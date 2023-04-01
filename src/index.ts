import { getInput } from "@actions/core";
import { globSync } from "glob";
import { readFile, writeFile } from "fs/promises";

const input = getInput("input", { required: true });
const substitutionRegexString = getInput("substitutionRegex", { required: true });
const substitutionData = getInput("substitutionData", { required: true });
const substitutionRegex = new RegExp(substitutionRegexString, "gm");

const inputFiles = globSync(input);
const substitutionMap = JSON.parse(substitutionData);

const replacementFunction = (match: string) => {
    if (substitutionMap[match] == null) {
        console.warn(`No substitution data for ${match}`);
    }
    return substitutionMap[match];
};

const handleFilePromises = inputFiles.map(async (file) => {
    const data = await readFile(file, "utf8");
    const result = data.replace(substitutionRegex, replacementFunction);
    return await writeFile(file, result);
});

Promise.all(handleFilePromises).then(() => {
    console.log("done");
});
