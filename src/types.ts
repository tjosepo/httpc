type Method = "GET" | "HEAD" | "POST";

export interface Config {
  method: Method;
  url: string;
  headers?: Record<string, string>;
  body?: string | Uint8Array;
}

export interface HttpClientResponse<T> {
  content: Uint8Array;
  json(): T;
  text(): string;
  verbose(): string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
}
