const http = require("http");
const app = require("./app");

const hostname = process.env.HOST;
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
