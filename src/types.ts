type Method = "GET" | "HEAD" | "POST";

export interface Config {
  method: Method;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface HttpClientResponse<T> {
  data: T;
  text: string;
  raw: string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
}
