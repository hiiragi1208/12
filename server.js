const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.static("public"));

app.use("/proxy", createProxyMiddleware({
  target: "https://example.com",
  changeOrigin: true,
  secure: false,

  router: (req) => {
    let url = req.query.url;

    if (!url) return "https://example.com";

    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    return url;
  },

  pathRewrite: {
    "^/proxy": ""
  },

  onProxyRes: (proxyRes) => {
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  }
}));

app.listen(3000, () => {
  console.log("Server running");
});