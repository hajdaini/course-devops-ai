import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

test("GET /health returns ok", async () => {
  const server = await listen(createApp());
  const response = await fetch(`${server.url}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, {
    status: "ok"
  });

  await close(server.instance);
});

test("GET /version returns version metadata", async () => {
  const server = await listen(
    createApp({
      version: "1.2.3",
      environment: "test"
    })
  );
  const response = await fetch(`${server.url}/version`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, {
    version: "1.2.3",
    environment: "test"
  });

  await close(server.instance);
});

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        instance: server,
        url: `http://${address.address}:${address.port}`
      });
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}
