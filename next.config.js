/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
            port: '',
            pathname: '/valo-buddy-storage/**',
          },
        ],
    },
}

module.exports = nextConfig
