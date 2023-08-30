/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    useDeploymentIdServerActions: true,
    serverActions: true
  },
}

export default nextConfig
