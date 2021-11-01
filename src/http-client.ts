import { indexOf, concat } from "https://deno.land/std@0.111.0/bytes/mod.ts";
import { Config, HttpClientResponse } from "./types.ts";
import Header from "./header.ts";

const CRLF = new Uint8Array([13, 10]);

function buildRequest(config: Config) {
  const { method, url, headers = {}, body } = config;
  new URL(url); // Validate url
  const pathname = "/" + url.split("/").slice(3).join("/");
  const encoder = new TextEncoder();
  let content: Uint8Array | undefined = undefined;

  if (body) {
    if (typeof body === "string") content = encoder.encode(body);
    else content = body;

    headers["Content-Length"] = content.length.toString();
  }

  let request = "";
  request += `${method} ${pathname} HTTP/1.0\r\n`;
  if (headers) {
    request += `${Header.stringify(headers)}\r\n`;
  }
  request += "\r\n";

  let message = encoder.encode(request);

  if (content) {
    message = concat(message, content);
  }

  return message;
}

async function sendRequest(url: string, request: Uint8Array) {
  let { hostname, port } = new URL(url);

  if (hostname === "0.0.0.0") hostname = "127.0.0.1";
  if (hostname === "localhost") hostname = "127.0.0.1";

  if (!port) port = "80";

  const conn = await Deno.connect({
    hostname,
    port: Number(port),
    transport: "tcp",
  });

  await conn.write(request);

  return conn;
}

async function readResponse<T>(conn: Deno.Conn) {
  const bufferSize = 32 * 1024;

  const response: any = {
    headers: {},
  };

  let gotEOF = false;
  const decoder = new TextDecoder();
  while (!gotEOF) {
    const bytes = new Uint8Array(bufferSize);
    const numberOfBytesRead = await conn.read(bytes);
    if (numberOfBytesRead === null) {
      gotEOF = true;
      continue;
    }

    let verbose = "";
    let lineStart = 0;
    let reachedCRLF = false;
    while (!reachedCRLF) {
      const lineEnd = indexOf(bytes, CRLF, lineStart);
      const line = decoder.decode(bytes.subarray(lineStart, lineEnd));
      verbose += line + "\r\n";

      if (lineStart === 0) {
        // Request Line
        const [_, status, statusText] = line.split(" ");
        response.status = Number(status);
        response.statusText = statusText;
      } else if (line) {
        // Header Line
        const [key, value] = Header.parseLine(line);
        response.headers[key] = value;
      } else {
        reachedCRLF = true;
      }

      lineStart = lineEnd + 2;
    }

    // Read Content
    const contentLength = Number(response.headers["content-length"]);
    let remainingBytes = contentLength;

    const chunk = bytes.subarray(lineStart, numberOfBytesRead);
    remainingBytes -= chunk.length;
    let content = chunk;

    while (remainingBytes > 0) {
      const numberOfBytesRead = await conn.read(bytes);
      if (numberOfBytesRead === null) break;
      content = concat(content, bytes.subarray(0, numberOfBytesRead));
      remainingBytes -= numberOfBytesRead;
    }

    response.content = content;
    response.text = () => new TextDecoder().decode(content);
    response.verbose = () => verbose + response.text();
    response.json = () => JSON.parse(response.text());

    break;
  }

  return response as HttpClientResponse<T>;
}

async function fetch<T>(config: Config) {
  const redirectLimit = 5;
  let redirectCount = 0;

  while (true) {
    const request = buildRequest(config);
    const conn = await sendRequest(config.url, request);
    const response = await readResponse<T>(conn);

    if (!isRedirect(response)) return response;
    if (redirectCount >= redirectLimit) throw Error("Too many redirects");

    redirectCount += 1;
    const redirectUrl = getRedirectUrl(response, config);

    config = { ...config, url: redirectUrl };
  }
}

// ==============================
// API
// ==============================

interface Options {
  headers?: Record<string, string>;
}

function get<T = any>(url: string, options?: Options) {
  const config: Config = {
    method: "GET",
    url,
    ...options,
  };

  return fetch<T>(config);
}

function post<T = any>(url: string, body?: any, options?: Options) {
  if (body && typeof body === "object" && body.constructor !== Uint8Array) {
    body = JSON.stringify(body);
  }

  const config: Config = {
    method: "POST",
    url,
    body,
    ...options,
  };

  return fetch<T>(config);
}

function head<T = any>(url: string, options?: Options) {
  const config: Config = {
    method: "HEAD",
    url,
    ...options,
  };

  return fetch<T>(config);
}

export default {
  get,
  head,
  post,
};

function isRedirect(response: HttpClientResponse<any>) {
  return response.status >= 300 && response.status < 400;
}

function getRedirectUrl(response: HttpClientResponse<any>, config: Config) {
  const location = response.headers["location"] ?? response.headers["Location"];

  if (location.charAt(0) === "/") {
    const url = new URL(config.url);
    url.pathname = location;
    return url.toString();
  } else {
    return new URL(location).toString();
  }
}
