const prefix = "/repositories"

const REPO_ENDPOINTS = {

    CREATE_REPO: `${prefix}/create`,
    GET_REPOS: `${prefix}/me`,
    GET_REPO_BY_ID: (repoId: string) => `${prefix}/${repoId}`,
    UPDATE_FILE: (repoId: string) => `${prefix}/${repoId}/files`,
    GET_TREE: (repoId: string) => `${prefix}/${repoId}/tree`,
    GET_FILE_CONTENT: (repoId: string, filePath: string) => `${prefix}/${repoId}/file?path=${filePath}`,
}

export default REPO_ENDPOINTS