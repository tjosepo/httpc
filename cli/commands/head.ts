import { HttpClient, Header } from "../deps.ts";
import { headUsage } from "./help.ts";

export async function headCommand(parameters: string[]) {
  let headers: Record<string, string> = {};
  let url: string | undefined = undefined;
  let filename: string | undefined = undefined;

  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];

    switch (parameter) {
      case "-h": {
        const nextParam = parameters[++i];
        const header = Header.parse(nextParam);
        headers = { ...headers, ...header };
        break;
      }
      case "-o":
        filename = parameters[++i];
        break;
      default:
        url = parameter;
    }
  }

  if (!url) {
    console.log(headUsage);
    return;
  }

  const response = await HttpClient.head(url, { headers });
  const output = response.verbose();
  if (filename) {
    Deno.writeTextFile(filename, output);
    return;
  }

  console.log(output);
}
