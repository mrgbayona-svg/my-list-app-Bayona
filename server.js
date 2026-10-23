const http = require("http");
const fs = require("fs");
const path = require("path");

// ===== MAKE IT YOURS: change these three lines =====
const APP_TITLE = "Goal Tracker";
const ITEM_NAME = "goal";
const OWNER = "Bayona, Rod Gabriel";

// ===================================================
const items = [{ id: 1, text: "Sample " + ITEM_NAME }];
function sendJson(res, status, data) {
res.writeHead(status, { "Content-Type": "application/json" });
res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
const url = req.url.split("?")[0];
if (req.method === "GET" && url === "/health") {
return sendJson(res, 200, { status: "ok" });
}
if (req.method === "GET" && url === "/api/info") {
return sendJson(res, 200, {
title: APP_TITLE,
itemName: ITEM_NAME,
owner: OWNER,
message: process.env.APP_MESSAGE || "Hello from my own app!",
});
}
if (url === "/api/items" && req.method === "GET") {
return sendJson(res, 200, items);
}
if (url === "/api/items" && req.method === "POST") {
let body = "";
req.on("data", (chunk) => (body += chunk));
req.on("end", () => {
let text = "";
try {
text = String(JSON.parse(body).text || "").trim();
} catch (e) {}
if (!text) return sendJson(res, 400, { error: "text is required" });
const item = { id: items.length + 1, text: text };
items.push(item);
sendJson(res, 201, item);
});
return;
}

if (req.method === "GET" && url === "/") {
return fs.readFile(path.join(__dirname, "public", "index.html"), (err, html) => {
if (err) return sendJson(res, 500, { error: "page missing" });
res.writeHead(200, { "Content-Type": "text/html" });
res.end(html);
});
}
sendJson(res, 404, { error: "not found" });
});
if (require.main === module) {
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Running on port " + PORT));
}
module.exports = server;