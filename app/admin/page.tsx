"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type UserRole = "student" | "teacher" | "admin";

type StoredUser = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
};

type AdminUser = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const [viewer, setViewer] = useState<StoredUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyUserId, setBusyUserId] = useState<number | null>(null);

  useEffect(() => {
    const run = async () => {
      const raw = localStorage.getItem("didasko_user");
      if (!raw) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      let currentUser: StoredUser | null = null;
      try {
        currentUser = JSON.parse(raw) as StoredUser;
      } catch {
        setError("Invalid local user session.");
        setLoading(false);
        return;
      }

      setViewer(currentUser);

      if (currentUser.role !== "admin") {
        setError("Admin access required.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/admin/users", {
          headers: { "x-user-email": currentUser.email },
        });
        const data = (await response.json()) as { message?: string; users?: AdminUser[] };
        if (!response.ok) {
          setError(data.message ?? "Unable to load admin data.");
          setLoading(false);
          return;
        }
        setUsers(data.users ?? []);
      } catch {
        setError("Network error while loading admin data.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const active = users.filter((u) => u.isActive).length;
    return { total, admins, active };
  }, [users]);

  const sendUpdate = async (
    userId: number,
    payload: { role?: UserRole; isActive?: boolean },
  ) => {
    if (!viewer) return;
    setBusyUserId(userId);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": viewer.email,
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string; user?: AdminUser };
      if (!response.ok || !data.user) {
        setError(data.message ?? "Unable to update user.");
        return;
      }
      setUsers((current) => current.map((u) => (u.id === userId ? data.user! : u)));
    } catch {
      setError("Network error while updating user.");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleRoleChange = async (userId: number, role: UserRole) => {
    await sendUpdate(userId, { role });
  };

  const handleToggleLock = async (user: AdminUser) => {
    await sendUpdate(user.id, { isActive: !user.isActive });
  };

  const handleDelete = async (user: AdminUser) => {
    if (!viewer) return;
    if (!window.confirm(`Delete account "${user.email}"?`)) return;
    setBusyUserId(user.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { "x-user-email": viewer.email },
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Unable to delete user.");
        return;
      }
      setUsers((current) => current.filter((u) => u.id !== user.id));
    } catch {
      setError("Network error while deleting user.");
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <main className="pixel-shell min-h-screen p-3 md:p-5">
      <div className="mx-auto w-full max-w-[1500px]">
        {loading ? (
          <section className="pixel-frame bg-[#fffbe8] p-5">
            <p className="text-sm font-semibold">Loading admin data...</p>
          </section>
        ) : error ? (
          <section className="pixel-frame bg-[#ffd6d6] p-5">
            <p className="text-sm font-black uppercase">{error}</p>
          </section>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[290px_1fr]">
            <aside className="pixel-frame bg-[#ffe682] p-4">
              <div className="pixel-frame bg-[#fffbe8] p-3">
                <p className="text-lg font-black">Didasko Admin</p>
                <p className="mt-1 text-sm font-semibold text-black/70">
                  Hello, {viewer?.fullName ?? "Admin"}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="pixel-frame bg-black px-3 py-2 text-sm font-black uppercase text-white">Users</div>
                <Link
                  href="/"
                  className="pixel-btn w-full bg-[#fffbe8] px-3 py-2 text-sm uppercase text-black"
                >
                  Home
                </Link>
              </div>

              <div className="mt-6 grid gap-2">
                <div className="pixel-frame bg-[#fffbe8] p-3">
                  <p className="text-xs font-black uppercase">Total</p>
                  <p className="mt-1 text-2xl font-black">{stats.total}</p>
                </div>
                <div className="pixel-frame bg-[#fffbe8] p-3">
                  <p className="text-xs font-black uppercase">Active</p>
                  <p className="mt-1 text-2xl font-black">{stats.active}</p>
                </div>
                <div className="pixel-frame bg-[#fffbe8] p-3">
                  <p className="text-xs font-black uppercase">Admins</p>
                  <p className="mt-1 text-2xl font-black">{stats.admins}</p>
                </div>
              </div>
            </aside>

            <section className="pixel-frame overflow-hidden bg-[#fffbe8]">
              <div className="border-b-2 border-black bg-[#ffe682] px-4 py-3">
                <h3 className="text-xl font-black uppercase">Manage Accounts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f3f4f6] text-xs font-black uppercase">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const isBusy = busyUserId === user.id;
                      const isSelf = viewer?.id === user.id;
                      return (
                        <tr key={user.id} className="border-t border-black/15 align-top">
                          <td className="px-4 py-3 font-semibold">{user.id}</td>
                          <td className="px-4 py-3 font-semibold">{user.fullName}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={user.role}
                              disabled={isBusy || isSelf}
                              onChange={(event) => {
                                void handleRoleChange(user.id, event.target.value as UserRole);
                              }}
                              className="pixel-input h-9 px-2 text-xs font-black uppercase"
                            >
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">{user.isActive ? "Active" : "Locked"}</td>
                          <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                disabled={isBusy || isSelf}
                                onClick={() => {
                                  void handleToggleLock(user);
                                }}
                                className="pixel-btn bg-[#ffd166] px-2 py-1 text-[11px] uppercase text-black disabled:opacity-60"
                              >
                                {user.isActive ? "Lock" : "Unlock"}
                              </button>
                              <button
                                type="button"
                                disabled={isBusy || isSelf}
                                onClick={() => {
                                  void handleDelete(user);
                                }}
                                className="pixel-btn bg-[#ffadad] px-2 py-1 text-[11px] uppercase text-black disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
