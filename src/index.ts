import { getInput, setFailed } from "@actions/core";

import { readFile, writeFile } from "fs/promises";
import { getFiles } from "./helper";

const input = getInput("input", { required: true });
const substitutionRegexString = getInput("substitutionRegex", { required: true });
const substitutionData = getInput("substitutionData", { required: true });
const substitutionRegex = new RegExp(substitutionRegexString, "gm");
const substitutionMap = JSON.parse(substitutionData);

const stats = new Map<string, number>();
const replacementFunction = (file: string) => (match: string, content: string) => {
    if (substitutionMap[content] == null) {
        console.warn(`No substitution data for ${content}`);
    }
    stats.set(file, (stats.get(file) ?? 0) + 1);
    return substitutionMap[content];
};

async function run() {
    const inputFiles = await getFiles(input);
    if (inputFiles.length === 0) {
        console.warn("No files found to process");
        return;
    }
    console.log("Found", inputFiles.length, "files to process");
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
