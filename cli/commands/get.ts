import { HttpClient, Header } from "../deps.ts";
import { getUsage } from "./help.ts";

export async function getCommand(parameters: string[]) {
  let verbose = false;
  let headers: Record<string, string> = {};
  let url: string | undefined = undefined;

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
      default:
        url = parameter;
    }
  }

  if (!url) {
    console.log(getUsage);
    return;
  }

  const response = await HttpClient.get(url, { headers });
  if (verbose) console.log(response.raw);
  else console.log(response.text);
}
