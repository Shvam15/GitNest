import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileNode } from "../components/ui/FileTreeNode";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const demoFileTree = [
    {
        id: "1",
        name: "src",
        type: "folder",
        children: [
            {
                id: "2",
                name: "app",
                type: "folder",
                children: [
                    {
                        id: "3",
                        name: "page.tsx",
                        type: "file",
                        content: `export default function Home() 
                        {
                             return <h1>Hello GitNest</h1> 
                        }`
                    }
                ]
            },
            {
                id: "4",
                name: "components",
                type: "folder",
                children: [
                    {
                        id: "5",
                        name: "Navbar.tsx",
                        type: "file",
                        content: `export const Navbar = () => 
                        {
                             return <div>Navbar</div> 
                        }`
                    }
                ]
            }
        ]
    },
    {
        id: "6",
        name: "public",
        type: "folder",
        children: [
            {
                id: "7",
                name: "logo.svg",
                type: "file",
                content: "<svg>...</svg>"
            }
        ]
    },
    {
        id: "8",
        name: "package.json",
        type: "file",
        content: `{
        "name": "gitnest",
        "version": "1.0.0"
        }`
    },
    {
        id: "9",
        name: "README.md",
        type: "file",
        content: `# GitNest A modern Git platform built with Next.js and NestJS.`
    },
    {
        id: "10",
        name: ".gitignore",
        type: "file",
        content: `node_modules 
        .next 
        .env `
    }
];

export const buildFilePath = (
    node: FileNode,
    currentPath: string = ""
): string => {
    return currentPath
        ? `${currentPath}/${node.name}`
        : node.name;
};