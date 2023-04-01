import { it, expect } from "vitest";
import { getFiles } from "../helper";

it("input files works", async () => {
    const files = await getFiles("*");
    expect(files).toBeInstanceOf(Array);
    expect(files).not.toHaveLength(0);
});
