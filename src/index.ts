import { getInput, setFailed } from "@actions/core";

import { readFile, writeFile } from "fs/promises";
import { getFiles } from "./helper";

const input = getInput("input", { required: true });
const substitutionRegexString = getInput("substitutionRegex", { required: true });
const substitutionData = getInput("substitutionData", { required: true });
const substitutionRegex = new RegExp(substitutionRegexString, "gm");
const substitutionMap = JSON.parse(substitutionData);

const stats = new Map<string, number>();
const replacementFunction = (file: string) => (match: string) => {
    if (substitutionMap[match] == null) {
        console.warn(`No substitution data for ${match}`);
    }
    stats.set(file, stats.get(file) ?? 0 + 1);
    return substitutionMap[match];
};

async function run() {
    const inputFiles = await getFiles(input);
    await Promise.all(
        inputFiles.map(async (file) => {
            const data = await readFile(file, "utf8");
            const result = data.replace(substitutionRegex, replacementFunction(file));
            await writeFile(file, result);
            if (stats.has(file)) {
                console.log(`Replaced ${stats.get(file)} matches in ${file}`);
            }
            return;
        })
    );
}

run()
    .then(() => {
        console.log("done");
    })
    .catch((e) => setFailed(e.message));
