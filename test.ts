import { HttpClient } from "./mod.ts";

const body = {
  Foo: "bar",
};

const { text } = await HttpClient.post("http://httpbin.org/post", body);

console.log(text);
