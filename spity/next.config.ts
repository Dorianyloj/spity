import type { NextConfig } from "next";
import { buildSecurityHeaders } from './src/lib/security-headers'

const runtimeEnvironment = process.env.NODE_ENV === 'production'
  ? 'production'
  : process.env.NODE_ENV === 'test'
    ? 'test'
    : 'development'

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: buildSecurityHeaders(runtimeEnvironment),
      }
    ]
  }
};

export default nextConfig;
