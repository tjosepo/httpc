import { Config, HttpClientResponse } from "./types.ts";
import Header from "./header.ts";

function getContentLength(content: string) {
  const encoder = new TextEncoder();
  return encoder.encode(content).length.toString();
}

function buildRequest(config: Config): string {
  const { method, url, headers = {}, body } = config;
  const { pathname, search } = new URL(url);

  if (body) {
    headers["Content-Length"] = getContentLength(body);
  }

  let request = "";
  request += `${method} ${pathname}${search} HTTP/1.0\n`;
  if (headers) {
    request += `${Header.stringify(headers)}\n`;
  }
  request += "\r\n";
  if (body) {
    request += `${body}`;
  }
  request += "\n";

  return request;
}

async function sendRequest(url: string, request: string) {
  const { hostname } = new URL(url);

  const conn = await Deno.connect({
    hostname,
    port: 80,
    transport: "tcp",
  });

  const encoder = new TextEncoder();
  const message = encoder.encode(request);
  await conn.write(message);

  return conn;
}

async function readResponse(conn: Deno.Conn) {
  const bufferSize = 32 * 1024;
  let response = "";
  let gotEOF = false;
  const decoder = new TextDecoder();
  while (!gotEOF) {
    const bytes = new Uint8Array(bufferSize);
    const numberOfBytesRead = await conn.read(bytes);
    if (numberOfBytesRead === null) {
      gotEOF = true;
      continue;
    }
    response += decoder.decode(bytes.subarray(0, numberOfBytesRead));
  }

  return response;
}

function parseResponse<T>(response: string): HttpClientResponse<T> {
  const [statusLine, ...headersAndBody] = response.split("\r\n");
  const [_, status, statusText] = statusLine.split(" ");

  const [rawHeaders, body] = headersAndBody.join("\r\n").split("\r\n\r\n");
  const headers = Header.parse(rawHeaders);

  let data = {};
  if (headers["Content-Type"] === "application/json" && body) {
    data = JSON.parse(body);
  }

  return {
    data: data as T,
    text: body,
    raw: response,
    status: Number(status),
    statusText,
    headers,
  };
}

async function fetch<T>(config: Config) {
  const request = buildRequest(config);
  const conn = await sendRequest(config.url, request);
  const raw = await readResponse(conn);
  return parseResponse<T>(raw);
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
  if (body && typeof body === "object") {
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