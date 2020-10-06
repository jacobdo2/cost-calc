const vercelUrl = process.env.VERCEL_URL.includes("http")
  ? process.env.VERCEL_URL
  : `https://${process.env.VERCEL_URL}`;
module.exports = {
  env: {
    API_URL: "https://bm-materials.com",
    URL: vercelUrl,
  },
};
