import { glob, stat } from "node:fs/promises";

export const getFiles = async (pattern: string): Promise<string[]> => {
    const files: string[] = [];
    for await (const file of glob(pattern)) {
        files.push(file);
    }
    // Filter out directories to match @actions/glob behavior with matchDirectories: false
    const fileStats = await Promise.all(
        files.map(async (file: string) => {
            const stats = await stat(file);
            return {
                path: file,
                isFile: stats.isFile(),
            };
        })
    );
    return fileStats.filter((item) => item.isFile).map((item) => item.path);
};
