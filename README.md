# httpc
httpc is a curl-like application but supports HTTP protocol only. It can also be used with Deno.

## Building
To build httpc:

1. Clone this repository.
2. With [Deno](https://deno.land/), build the app by running:
```
$ deno compile --allow-net --allow-read --allow-write cli/httpc.ts
```
or build directly without cloning:
```
$ deno compile --allow-net --allow-read --allow-write "https://github.com/tommy-josepovic/httpc/raw/main/cli/httpc.ts"
```

## Usage with CLI
```
Usage:
    httpc command [arguments]

The commands are:
    get     executes a HTTP GET request and prints the response.
    head    executes a HTTP HEAD request and prints the response.
    post    executes a HTTP POST request and prints the response.
    help    prints this screen.
    
Use "httpc help [command]" for more information about a command.
```

## Usage with Deno
You can import ``HttpClient`` with the following line:

```ts
import { HttpClient } from "https://github.com/tommy-josepovic/httpc/raw/main/mod.ts";
```

You can use it like this:

```ts
const response = await HttpClient.get("http://httpbin.org/get");

if (response.statusText === "OK") {
  // Do something...
}
```

### API 
| Name| Description |
|---|---|
| get(url, option?) | Executes a HTTP GET request |
| head(url, option?) | Executes a HEAD GET request |
| post(url, data?, option?)| Executes a POST GET request |


