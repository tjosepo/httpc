const general =
  "httpc is a curl-like application but supports HTTP protocol only.\n" +
  "\n" +
  "Usage:\n" +
  "    httpc command [arguments]\n" +
  "\n" +
  "The commands are:\n" +
  "    get     executes a HTTP GET request and prints the response.\n" +
  "    head    executes a HTTP HEAD request and prints the response.\n" +
  "    post    executes a HTTP POST request and prints the response.\n" +
  "    help    prints this screen.\n" +
  "\n" +
  'Use "httpc help [command]" for more information about a command.';

export const getUsage =
  "usage: httpc get [-v] [-h key:value] URL\n" +
  "\n" +
  "Get executes a HTTP GET request for a given URL.\n" +
  "   -v             Prints the detail of the response such as protocol, status, and headers.\n" +
  "   -h key:value   Associates headers to HTTP Request with the format 'key:value'.";

export const headUsage =
  "usage: httpc head [-h key:value] URL\n" +
  "\n" +
  "Get executes a HTTP HEAD request for a given URL.\n" +
  "   -h key:value   Associates headers to HTTP Request with the format 'key:value'.";

export const postUsage =
  "usage: httpc post [-v] [-h key:value] [-d inline-data] [-f file] URL\n" +
  "\n" +
  "Post executes a HTTP POST request for a given URL with inline data or from file.\n" +
  "   -v             Prints the detail of the response such as protocol, status, and headers.\n" +
  "   -h key:value   Associates headers to HTTP Request with the format 'key:value'.\n" +
  "   -d string      Associates an inline data to the body HTTP POST request.\n" +
  "   -f file        Associates the content of a file to the body HTTP POST request.\n" +
  "\n" +
  "Either [-d] or [-f] can be used but not both.";

export function helpCommand(parameters: string[]) {
  const command = parameters[0];

  switch (command) {
    case "get":
      console.log(getUsage);
      break;
    case "head":
      console.log(headUsage);
      break;
    case "post":
      console.log(postUsage);
      break;
    case undefined:
      console.log(general);
      break;
    default:
      console.log(`httpc: '${command}' is not a command. See 'httpc help'.`);
  }
}
