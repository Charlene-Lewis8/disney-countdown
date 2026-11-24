import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Magical Disney Countdown",
    short_name: "Disney Days",
    description: "Counting down the sleeps until Disney on July 21, 2027!",
    start_url: "/",
    display: "standalone",
    background_color: "#7dd3fc",
    theme_color: "#9333ea",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}