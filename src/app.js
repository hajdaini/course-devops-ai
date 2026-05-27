import { createServer } from "node:http";

export function createApp(metadata = {}) {
  const version = metadata.version ?? process.env.APP_VERSION ?? "dev";
  const environment = metadata.environment ?? process.env.APP_ENV ?? "local";

  return createServer((request, response) => {
    if (request.method === "GET" && request.url === "/health") {
      sendJson(response, 200, {
        status: "ok"
      });
      return;
    }

    if (request.method === "GET" && request.url === "/version") {
      sendJson(response, 200, {
        version,
        environment
      });
      return;
    }

    sendJson(response, 404, {
      error: "not_found"
    });
  });
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json"
  });
  response.end(JSON.stringify(body));
}
