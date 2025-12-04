/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cantara/types', '@cantara/utils', '@cantara/sdk',
    "@mui/material",
    "@mui/system",
    "@emotion/react",
    "@emotion/styled",
  ],
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/system"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = new URL('./src', import.meta.url).pathname;
    return config;
  },
};

export default nextConfig;
