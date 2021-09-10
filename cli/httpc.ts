import {
  getCommand,
  headCommand,
  postCommand,
  helpCommand,
} from "./commands/mod.ts";

const [command, ...parameters] = Deno.args;

switch (command) {
  case "get":
    await getCommand(parameters);
    break;
  case "head":
    await headCommand(parameters);
    break;
  case "post":
    await postCommand(parameters);
    break;
  case "help":
  case undefined:
    helpCommand(parameters);
    break;
  default:
    console.log(`httpc: '${command}' is not a command. See 'httpc help'.`);
    break;
}
