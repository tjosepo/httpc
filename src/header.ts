/**
 * Converts a HTTP header string into an object.
 * @param text A valid HTTP header.
 */
function parse(text: string): Record<string, string> {
  const headers: Record<string, string> = {};

  const lines = text.split("\r\n");
  for (const line of lines) {
    const [name, ...value] = line.split(":");
    headers[name.trim()] = value.join(":").trimStart();
  }

  return headers;
}

/**
 * Converts a JavaScript object to a HTTP header string.
 * @param text A JavaScript object.
 */
function stringify(headers: Record<string, string>): string {
  const lines = [];
  for (const fieldName in headers) {
    const header = `${fieldName}: ${headers[fieldName]}`;
    lines.push(header);
  }

  return lines.join("\r\n");
}

export default {
  parse,
  stringify,
};
