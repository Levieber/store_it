import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

await jiti.import("./lib/environment/index.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
