import { buildFilePath } from "@/src/utils/utils";
import { FolderGit2, File } from "lucide-react";

export interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    content?: string;
    children?: FileNode[];
}

interface FileTreeNodeProps {
    node: FileNode;
    currentPath?: string;
    onFileClick: (file: FileNode, path: string) => void;
}


export function FileTreeNode({
    node,
    currentPath,
    onFileClick,
}: FileTreeNodeProps) {
    
    const fullPath = currentPath
        ? `${currentPath}/${node.name}`
        : node.name;

    return (
        <div className="ml-2">
            <button
                onClick={() => onFileClick(node, fullPath)}
                className={`flex items-center gap-2 py-1 hover:underline hover:cursor-pointer hover:offset-2 ${node.type === "folder"
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-emerald-300 hover:text-emerald-200"
                    }`}
            >
                {node.type === "folder" ? (
                    <FolderGit2 className="h-4 w-4" />
                ) : (
                    <File className="h-4 w-4" />
                )}

                {node.name}
            </button>

            {node.children?.length ? (
                <div className="ml-5 border-l border-zinc-800 pl-3">
                    {node.children.map((child) => (
                        <FileTreeNode
                            key={child.id}
                            node={child}
                            currentPath={fullPath}
                            onFileClick={onFileClick}
                        />
                    ))}
                </div>
            ) : null}

        </div>
    );
}