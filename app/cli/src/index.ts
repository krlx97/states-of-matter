import fs from "fs/promises";
import path from "path";
import requests from "./requests.js";

const toCamelCase = (name: string): string => {
  return name.split("-").map((word, i) => {
    if (i === 0) {
      return word.toLowerCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }).join("");
};

const toPascalCase = (name: string): string => {
  return name.split("-").map((word, i) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join("");
};

const write = async (fileName: string): Promise<void> => {
  const camelCase = toCamelCase(fileName);
  const PascalCase = toPascalCase(fileName);

  console.log(camelCase, PascalCase, path.resolve("../../../"));

  await fs.writeFile(`./${camelCase}.ts`, `
    import {SocketRequest} from "models";

    export const ${camelCase}: SocketRequest = (services) => {
      services.socketService.socket.on("${camelCase}", (params) => {
        //...
      });
    };
  `.trim());

  await rebuildIndex(PascalCase);
};

const rebuildIndex = async (fileName: string) => {
  let template = "";
  let requestz = "";

  requests.forEach((request) => {
    const x = Object.keys(request.req) as Array<keyof typeof request.req>;

    template += `import ${request.name} from "./${request.name}";\n`;

    requestz +=
      `interface ${fileName}Req {\n` +
        `${x.map((req) => ` ${req}: ${request.req[req]};\n`).join("")}` +
      `}\n`;
  });

  await fs.writeFile(`./_index.ts`, template);
  await fs.writeFile(`./_${fileName}.ts`, requestz);
};

await write("getPrivateKeyHash");
