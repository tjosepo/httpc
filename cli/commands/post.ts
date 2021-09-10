import { HttpClient, Header } from "../deps.ts";
import { postUsage } from "./help.ts";

export async function postCommand(parameters: string[]) {
  let verbose = false;
  let headers: Record<string, string> = {};
  let url: string | undefined = undefined;
  let body: string | undefined = undefined;

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
        body = await Deno.readTextFile(parameters[++i]);
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
  if (verbose) console.log(response.raw);
  else console.log(response.text);
}
