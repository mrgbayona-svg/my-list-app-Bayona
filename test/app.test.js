const test = require("node:test");
const assert = require("node:assert");
const server = require("../server");
let base;
test.before(async () => {
await new Promise((resolve) => server.listen(0, resolve));
base = "http://localhost:" + server.address().port;
});
test.after(() => server.close());
test("health check says ok", async () => {
const res = await fetch(base + "/health");
assert.strictEqual(res.status, 200);
assert.deepStrictEqual(await res.json(), { status: "ok" });
});
test("can add an item", async () => {
const res = await fetch(base + "/api/items", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ text: "Test item" }),
});
assert.strictEqual(res.status, 201);
const list = await (await fetch(base + "/api/items")).json();
assert.ok(list.some((i) => i.text === "Test item"));
});
test("rejects an empty item", async () => {
const res = await fetch(base + "/api/items", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ text: " " }),
});
assert.strictEqual(res.status, 400);
});