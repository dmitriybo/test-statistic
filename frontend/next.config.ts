import { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, 'frontend'),
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig
