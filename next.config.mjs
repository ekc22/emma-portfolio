/**
 * Static export for GitHub Pages.
 * The site is served from https://<user>.github.io/<repo>/, so every route and
 * asset needs the repo name as a prefix. The deploy workflow sets
 * NEXT_PUBLIC_BASE_PATH=/emma-portfolio; locally it is empty.
 * With a custom domain, set NEXT_PUBLIC_BASE_PATH to "" in the workflow.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // GitHub Pages has no image server; resize photos before adding them to public/images.
  images: { unoptimized: true },
};
export default nextConfig;
