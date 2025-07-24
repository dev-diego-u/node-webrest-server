import fs from "fs";
import http from "http";

const server = http.createServer((req, res) => {
  console.log(req.url);
  // res.write("Hello, World!\n");
  // res.end("Hello, World!\n");

  // const data = { name: "Diego", age: 30, city: "Madrid" };
  // res.writeHead(200, {
  //   "Content-Type": "application/json",
  //   "Access-Control-Allow-Origin": "*",
  // });
  // res.end(JSON.stringify(data));
  // const indexHtml = fs.readFileSync("public/index.html", "utf-8");
  if (req.url === "/") {
    const htmlFile = fs.readFileSync("./public/index.html", "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlFile);
    return;
  }

  if (req.url?.endsWith(".js")) {
    res.writeHead(200, { "Content-Type": "application/javascript" });
  } else if (req.url?.endsWith(".css")) {
    res.writeHead(200, { "Content-Type": "text/css" });
  }

  const responseContent = fs.readFileSync(`./public${req.url}`, "utf-8");
  res.end(responseContent);
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
