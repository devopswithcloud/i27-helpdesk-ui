/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits .next/standalone: a minimal server.js + only the node_modules it needs.
  // The Dockerfile copies just that into the runtime image.
  output: 'standalone',
};

module.exports = nextConfig;
