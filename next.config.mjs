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
  async headers() {
    const day = "public, max-age=86400, stale-while-revalidate=604800";
    const forever = "public, max-age=31536000, immutable";
    return [
      { source: "/landing/:path*", headers: [{ key: "Cache-Control", value: day }] },
      { source: "/explanations/:path*", headers: [{ key: "Cache-Control", value: day }] },
      { source: "/landing/tutors.json", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
      { source: "/landing/img/:path*", headers: [{ key: "Cache-Control", value: forever }] },
      { source: "/recall-img/:path*", headers: [{ key: "Cache-Control", value: forever }] },
    ];
  },
};

export default nextConfig;
