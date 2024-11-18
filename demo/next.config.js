/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/chart",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM *",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
