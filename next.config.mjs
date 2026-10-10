/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          missing: [{ type: "cookie", key: "fcps_session" }],
          destination: "/landing.html",
        },
      ],
    };
  },
};

export default nextConfig;
