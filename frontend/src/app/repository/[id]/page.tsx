'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  File,
  FolderGit2,
  Globe,
  Hash,
  Loader2,
  Lock,
  RefreshCcw
} from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import { ServiceManager } from '@/src/services/api.serviceManager';
import { FileTreeNode } from '@/src/components/ui/FileTreeNode';
import { Editor } from '@monaco-editor/react';
import toast from 'react-hot-toast';

type RepositoryDetails = {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function RepositoryPage() {
  const params = useParams();
  const router = useRouter();
  const repoId = params.id as string;

  const [repoDetails, setRepoDetails] = useState<RepositoryDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileTree, setFileTree] = useState([]);


  const fetchTree = async () => {
    const res = await ServiceManager.getTree(repoId);
    console.log("tree", res)
    setFileTree(res?.data);
  };
  
  useEffect(() => {
    fetchTree();
  }, []);

  const fetchRepositoryById = async () => {
    try {
      setIsLoading(true);
      setError('');

      const res = await ServiceManager.getRepositoryById(repoId);

      if (res?.success) {
        setRepoDetails(res?.data);
      } else {
        setError('Unable to fetch repository details.');
      }
    } catch (error) {
      console.log(error);
      setError('Something went wrong while fetching repository details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (repoId) {
      fetchRepositoryById();
    }
  }, [repoId]);

  const getFileContent = async () => {
    try {
      const res = await ServiceManager.getFileContent(repoId, selectedFilePath);
      console.log("res", res);
      if (res?.success) {
        setFileContent(res?.data);
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleFileClick = (node: any, path: string) => {
    console.log("node", node, "path", path)
    if (node.type === "file") {
      setSelectedFile(node);
      setSelectedFilePath(path);
    }
  };

  useEffect(() => {
    if (selectedFilePath) {
      getFileContent();
    }
  }, [selectedFilePath]); // Dependency array


  const getFileType = (fileName: string) => {
    if (!fileName) return 'plaintext';
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'jsx';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  const handleFileSave = async (filePath: any) => {
    try {
      const res = await ServiceManager.updateFile(repoId, filePath, fileContent);
      console.log("res", res);
      if (res?.success) {
        toast.success("File saved successfully");
      } else {
        toast.error("Failed to save file");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 text-white md:px-6 lg:px-8">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0 " />
      <div className="relative mx-auto max-w-7xl">
        {/* top actions */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <Button
            type="button"
            variant="outline"
            onClick={fetchRepositoryById}
            className="w-fit border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-center gap-3 text-zinc-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading repository details...
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="h-28 animate-pulse rounded-xl bg-white/5" />
              <div className="h-28 animate-pulse rounded-xl bg-white/5" />
              <div className="h-28 animate-pulse rounded-xl bg-white/5" />
            </div>

            <div className="mt-6 h-40 animate-pulse rounded-xl bg-white/5" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <p className="text-lg font-semibold text-white">Failed to load repository</p>
            <p className="mt-2 text-sm text-zinc-400">{error}</p>

            <Button
              type="button"
              onClick={fetchRepositoryById}
              className="mt-5 bg-blue-600 text-white hover:bg-blue-500"
            >
              Try Again
            </Button>
          </div>
        ) : repoDetails ? (
          <div className="space-y-6">
            {/* header card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
                    <FolderGit2 className="h-7 w-7" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {repoDetails.name}
                      </h1>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${repoDetails.isPrivate
                          ? 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/20'
                          : 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20'
                          }`}
                      >
                        {repoDetails.isPrivate ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : (
                          <Globe className="h-3.5 w-3.5" />
                        )}
                        {repoDetails.isPrivate ? 'Private' : 'Public'}
                      </span>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                      {repoDetails.description?.trim()
                        ? repoDetails.description
                        : 'No description has been added for this repository yet.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* info cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-zinc-300">
                  <Hash className="h-4 w-4" />
                </div>
                <p className="text-sm text-zinc-400">Repository ID</p>
                <p className="mt-1 break-all text-sm font-medium text-white">
                  {repoDetails._id || repoDetails.id || repoId}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-zinc-300">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <p className="text-sm text-zinc-400">Created At</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {formatDate(repoDetails.createdAt)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-zinc-300">
                  <Clock3 className="h-4 w-4" />
                </div>
                <p className="text-sm text-zinc-400">Last Updated</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {formatDate(repoDetails.updatedAt)}
                </p>
              </div>
            </div>

            {/* file tree */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">

              <h2 className="mb-4 text-lg font-semibold text-white">
                Nest Editor
              </h2>

              <div className="flex h-[600px] overflow-hidden rounded-xl border border-white/10">
                {/* File Tree */}
                <div className="w-72 overflow-y-auto border-r border-white/10 bg-black/20 p-4">
                  {fileTree?.map((node: any) => (
                    <FileTreeNode
                      key={node.id}
                      node={node}
                      currentPath={""}
                      onFileClick={handleFileClick}
                    />
                  ))}
                </div>

                {/* Editor / Viewer */}
                <div className="flex-1 overflow-hidden bg-black/10">

                  {selectedFile ? (
                    <div className="flex h-full flex-col">
                      {/* File Header */}
                      <div className="border-b border-white/10 px-4 py-3 flex justify-between items-center">
                        <h3 className="font-medium text-white">
                          {selectedFilePath}
                        </h3>
                        <button onClick={() => handleFileSave(selectedFilePath)} className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer " >
                          Save
                        </button>
                      </div>
                      {/* File Content */}
                      <div className="flex-1 overflow-auto p-4">
                        <Editor
                          height="100%"
                          defaultLanguage={getFileType(selectedFile?.name)}
                          value={fileContent}
                          onChange={(value) => setFileContent(value || "")}
                          theme="vs-dark"
                          options={{
                            minimap: {
                              enabled: true,
                            },
                            fontSize: 14,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      Select a file to view its contents
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* about section */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <h2 className="text-lg font-semibold text-white">About Repository</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {repoDetails.description?.trim()
                  ? repoDetails.description
                  : 'This repository currently has no detailed description. You can add more details later to help collaborators understand the project better.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-lg font-semibold text-white">Repository not found</p>
            <p className="mt-2 text-sm text-zinc-400">
              We could not find any details for this repository.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}