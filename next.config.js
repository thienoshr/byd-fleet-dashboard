/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Don't fail build on ESLint errors (warnings are fine)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Don't fail build on TypeScript errors (only show warnings)
  typescript: {
    ignoreBuildErrors: false, // Keep this false to catch real TS errors
  },
  webpack: (config, { isServer }) => {
    // Exclude better-sqlite3 from webpack bundling (it's a native module)
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('better-sqlite3')
    }
    return config
  },
}

module.exports = nextConfig















