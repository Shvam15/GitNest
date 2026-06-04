import { apiCall } from "./api";
import { ENDPOINTS } from "./api.endpoints";
import REPO_ENDPOINTS from "./endpoints/Repository/repo.endpoints";

export const ServiceManager = {

    login: (data: any) => {
        return apiCall(ENDPOINTS.LOGIN, "POST", data)
    },

    signup: (data: any) => {
        return apiCall(ENDPOINTS.SIGNUP, "POST", data)
    },

    logout: (data: any) => {
        return apiCall(ENDPOINTS.LOGOUT, "POST", data)
    },

    createRepo: (data: any) => {
        return apiCall(REPO_ENDPOINTS.CREATE_REPO, "POST", data)
    },

    getRepositories: () => {
        return apiCall(REPO_ENDPOINTS.GET_REPOS, "GET")
    },

    getRepositoryById: (repoId: string) => {
        console.log("repo if",repoId)
        return apiCall(REPO_ENDPOINTS.GET_REPO_BY_ID(repoId), "GET")
    },

    updateFile: (repoId: string, filePath: string, content: string) => {
        console.log("repo id",repoId)
        console.log("content",content)
        return apiCall(REPO_ENDPOINTS.UPDATE_FILE(repoId), "POST", {filePath, content})
    },

    getTree: (repoId: string) => {
        return apiCall(REPO_ENDPOINTS.GET_TREE(repoId), "GET")
    },

    getFileContent: (repoId: string, filePath: string) => {
        return apiCall(REPO_ENDPOINTS.GET_FILE_CONTENT(repoId, filePath), "GET")
    }
}