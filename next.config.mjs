import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

await jiti.import("./lib/environment/index.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "could.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
