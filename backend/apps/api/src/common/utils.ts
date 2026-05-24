import { join } from "path"
import { mkdir, writeFile } from "fs/promises"

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

export async function createFileStorage(createFileStorage: CreateFileStorage) {
    try {
        const { body, type } = createFileStorage

        console.log("body", body)
        console.log("type", type)

        if (type === 'repo') {
            const baseDir = join(process.cwd(), 'storage')
            const repoDir = join(baseDir, body?.id)

            await mkdir(repoDir, { recursive: true })

            return repoDir
        }

        if (type === 'commit') {
            const baseDir = join(process.cwd(), 'storage')
            const repoDir = join(baseDir, body?.repoId)
            const commitDir = join(repoDir, body?.id)

            await mkdir(commitDir, { recursive: true })

            return commitDir
        }

        return null

    } catch (error) {
        console.log("error in createFileStorage", error)
        throw error
    }
}

export async function storeSnapshots(storeSnapshots: StoreSnapshots) {
    try {
        const { body, type, files } = storeSnapshots

        console.log("body", body)   
        console.log("type", type)
        console.log("files", files)

        if (type === 'commit') {
            const baseDir = join(process.cwd(), 'storage')
            const repoDir = join(baseDir, body?.repoId)
            const commitDir = join(repoDir, body?.id)

            await writeFile(join(commitDir, 'snapshot.json'), JSON.stringify(files))
            return commitDir
        }

        return null

    } catch (error) {
        console.log("error in createFileStorage", error)
        throw error
    }
}