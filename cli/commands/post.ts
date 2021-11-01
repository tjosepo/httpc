import { HttpClient, Header } from "../deps.ts";
import { postUsage } from "./help.ts";

export async function postCommand(parameters: string[]) {
  let verbose = false;
  let headers: Record<string, string> = {};
  let url: string | undefined = undefined;
  let body: Uint8Array | string | undefined = undefined;
  let filename: string | undefined = undefined;

  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];

    switch (parameter) {
      case "-v":
        verbose = true;
        break;
      case "-h": {
        const nextParam = parameters[++i];
        const header = Header.parse(nextParam);
        headers = { ...headers, ...header };
        break;
      }
      case "-d":
        body = parameters[++i];
        break;
      case "-f":
        body = await Deno.readFile(parameters[++i]);
        break;
      case "-o":
        filename = parameters[++i];
        break;
      default:
        url = parameter;
    }
  }

  if (!url) {
    console.log(postUsage);
    return;
  }

  const response = await HttpClient.post(url, body, { headers });
  const output = verbose ? response.verbose() : response.text();
  if (filename) {
    Deno.writeTextFile(filename, output);
    return;
  }

  console.log(output);
}
