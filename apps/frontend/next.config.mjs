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
};

export default nextConfig;
