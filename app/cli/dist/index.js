import fs from "fs/promises";
import path from "path";
import requests from "./requests.js";
const toCamelCase = (name) => {
    return name.split("-").map((word, i) => {
        if (i === 0) {
            return word.toLowerCase();
        }
        else {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
    }).join("");
};
const toPascalCase = (name) => {
    return name.split("-").map((word, i) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join("");
};
const write = async (fileName) => {
    const camelCase = toCamelCase(fileName);
    const PascalCase = toPascalCase(fileName);
    console.log(camelCase, PascalCase, path.resolve("../../../"));
    await fs.writeFile(`./${camelCase}.ts`, `
    import {${PascalCase}Req} from "@som/shared/interfaces/requests";
    import {SocketRequest} from "models";

    const ${camelCase}: SocketRequest<${PascalCase}> = async (services, params) => {

    };

    export default ${camelCase};
  `);
    await rebuildIndex(PascalCase);
};
const rebuildIndex = async (fileName) => {
    let template = "";
    let requestz = "";
    requests.forEach((request) => {
        const x = Object.keys(request.req);
        template += `import ${request.name} from "./${request.name}";\n`;
        requestz +=
            `interface ${fileName}Req {\n` +
                `${x.map((req) => `  ${req}: ${request.req[req]};\n`).join("")}` +
                `}\n`;
    });
    await fs.writeFile(`./_index.ts`, template);
    await fs.writeFile(`./_${fileName}.ts`, requestz);
};
await write("getPrivateKeyHash");
