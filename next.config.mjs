/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    return backend
      ? [
          {
            source: "/api/:path*",
            destination: `${backend}/api/:path*`,
          },
        ]
      : [];
  },
};

export default nextConfig;
