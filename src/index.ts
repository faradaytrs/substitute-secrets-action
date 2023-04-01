import { getInput, setFailed } from "@actions/core";
import { create } from "@actions/glob";
import { readFile, writeFile } from "fs/promises";

const input = getInput("input", { required: true });
const substitutionRegexString = getInput("substitutionRegex", { required: true });
const substitutionData = getInput("substitutionData", { required: true });
const substitutionRegex = new RegExp(substitutionRegexString, "gm");
const substitutionMap = JSON.parse(substitutionData);

const replacementFunction = (match: string) => {
    if (substitutionMap[match] == null) {
        console.warn(`No substitution data for ${match}`);
    }
    return substitutionMap[match];
};

const getFiles = async (pattern: string) => {
    const globber = await create(pattern, {
        matchDirectories: false
    });
    return await globber.glob();
};

async function run() {
    const inputFiles = await getFiles(input);
    await Promise.all(
        inputFiles.map(async (file) => {
            const data = await readFile(file, "utf8");
            const result = data.replace(substitutionRegex, replacementFunction);
            return await writeFile(file, result);
        })
    );
}

run()
    .then(() => {
        console.log("done");
    })
    .catch((e) => setFailed(e.message));
