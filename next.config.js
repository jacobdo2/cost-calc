const vercelUrl = process.env.URL.includes("http")
  ? process.env.URL
  : `https://${process.env.URL}`;
module.exports = {
  env: {
    API_URL: "https://bm-materials.com",
    URL: vercelUrl,
  },
};
