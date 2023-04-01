import { create } from "@actions/glob";

export const getFiles = async (pattern: string) => {
    const globber = await create(pattern, {
        matchDirectories: false,
    });
    return await globber.glob();
};
