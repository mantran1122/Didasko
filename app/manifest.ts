import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Didasko",
    short_name: "Didasko",
    description: "Launch and run your course with ease.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff9cc",
    theme_color: "#ffd166",
    icons: [
      {
        src: "/icon.svg",
        sizes: "64x64",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.svg",
        sizes: "64x64",
        type: "image/svg+xml",
      },
    ],
  };
}
