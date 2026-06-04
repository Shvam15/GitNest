import { dirname, join } from "path"
import { mkdir, writeFile } from "fs/promises"
import { readdir } from 'fs/promises';
import { readFile, readFileSync } from "fs";

interface CreateFileStorage {
    user: any
    body: any
    type: 'repo' | 'commit'
}

interface StoreSnapshots {
    user: any
    body: any
    files: string[]
    type: 'repo' | 'commit'
}

const STORAGE_ROOT = join(
    process.cwd(),
    "..",
    "..",
    "..",
    "GitNestData"
);

export async function createFileStorage(
    createFileStorage: CreateFileStorage
) {
    try {
        const { body, type } = createFileStorage;

        if (type === "repo") {
            const repoDir = join(STORAGE_ROOT, body.id);

            await mkdir(repoDir, {
                recursive: true,
            });

            return repoDir;
        }

        if (type === "commit") {
            const commitDir = join(
                STORAGE_ROOT,
                body.repoId,
                ".commits",
                body.id
            );

            await mkdir(commitDir, {
                recursive: true,
            });

            return commitDir;
        }

        return null;

    } catch (error) {
        console.log("error in createFileStorage", error);
        throw error;
    }
}
export async function storeSnapshots(
    storeSnapshots: StoreSnapshots
) {
    try {

        const { body, type, files } = storeSnapshots;

        if (type === "commit") {

            const commitDir = join(
                STORAGE_ROOT,
                body.repoId,
                ".commits",
                body.id
            );

            await mkdir(commitDir, {
                recursive: true,
            });

            await writeFile(
                join(commitDir, "snapshot.json"),
                JSON.stringify(files, null, 2)
            );

            return commitDir;
        }

        return null;

    } catch (error) {
        console.log("error in storeSnapshots", error);
        throw error;
    }
}

export async function saveFile(
    repoId: string,
    filePath: string,
    content: string
) {
    try {

        const fullPath = join(
            STORAGE_ROOT,
            repoId,
            filePath
        );

        const directory = dirname(fullPath);

        await mkdir(directory, {
            recursive: true,
        });

        await writeFile(
            fullPath,
            content,
            "utf-8"
        );

        return fullPath;

    } catch (error) {
        console.log("error in saveFile", error);
        throw error;
    }
}

export async function getFileTree(dir: string) {
    const entries = await readdir(dir, {
        withFileTypes: true,
    });
    console.log("entries", entries)
    return Promise.all(
        entries.map(async (entry) => {
            const fullPath = join(dir, entry.name);
            console.log("fullPath", fullPath)
            if (entry.isDirectory()) {
                return {
                    name: entry.name,
                    type: 'folder',
                    children: await getFileTree(fullPath),
                };
            }

            return {
                name: entry.name,
                type: 'file',
            };
        })
    );
}

export async function getFileContent(repoPath: string, filePath: string) {
    try {
        const fullPath = join(repoPath, filePath);
        console.log("fullPath", fullPath)
        const content = await readFileSync(fullPath, 'utf-8');
        console.log("content", content)
        return content;
    } catch (error) {
        console.log("error in getFileContent", error);
        throw error;
    }
}