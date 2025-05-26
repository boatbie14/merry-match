/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn3.gstatic.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'dlvptnewdgewaptlqbsa.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
