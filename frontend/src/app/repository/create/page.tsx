'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Lock, FolderGit2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ServiceManager } from "@/src/services/api.serviceManager";
import toast from "react-hot-toast";

export default function CreateRepository() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isPrivate: false,
    });

    const repoPreview = useMemo(() => {
        const slug =
            formData.name
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-") || "repository-name";

        return `yourworkspace/${slug}`;
    }, [formData.name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const { name, description, isPrivate } = formData

            if (!name || !description) {
                toast.error("Please fill all the fields")
                return
            }

            const payload = {
                name,
                description,
                is_private: isPrivate
            }

            const res = await ServiceManager.createRepo(payload)
            console.log("Repository Data:", res);
            if (res?.success) {
                toast.success("Repo created successfully")
                router.push(`/repository/${res?.data?.id}`)
            }
        }
        catch (error) {
            toast.error("Failed to create repo")
            console.log(error)
        }
    }
    return (
        <div className="min-h-screen px-4 py-10 text-white">
            <div className="mx-auto max-w-3xl">
                {/* top action */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 cursor-pointer cursor-pointer inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* card */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    {/* header */}
                    <div className="border-b border-white/10 px-6 py-6 md:px-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                                <FolderGit2 className="h-6 w-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Create Repository
                                </h1>
                                <p className="mt-1 text-sm text-zinc-400">
                                    Start a new project and manage your code in one place.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* form */}
                    <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 md:px-8">
                        {/* Repository Name */}
                        <div className="space-y-2">
                            <label
                                htmlFor="repo-name"
                                className="text-sm font-medium text-zinc-200"
                            >
                                Repository Name
                            </label>
                            <Input
                                id="repo-name"
                                type="text"
                                placeholder="e.g. frontend-app"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="h-11 border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
                            />
                            <p className="text-xs text-zinc-500">
                                This will be your repository URL:
                                <span className="ml-1 text-zinc-300">{repoPreview}</span>
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label
                                htmlFor="repo-description"
                                className="text-sm font-medium text-zinc-200"
                            >
                                Description
                            </label>
                            <textarea
                                id="repo-description"
                                placeholder="Write a short description about this repository"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={4}
                                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <p className="text-xs text-zinc-500">
                                Briefly describe the purpose of this repository.
                            </p>
                        </div>

                        {/* Visibility */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-zinc-200">Visibility</p>

                            <div className="grid gap-3 md:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, isPrivate: false })
                                    }
                                    className={`rounded-xl border p-4 text-left transition ${!formData.isPrivate
                                        ? "border-blue-500/40 bg-blue-500/10"
                                        : "border-white/10 bg-black/10 hover:bg-white/5"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`mt-0.5 rounded-lg p-2 ${!formData.isPrivate
                                                ? "bg-blue-500/15 text-blue-400"
                                                : "bg-white/5 text-zinc-400"
                                                }`}
                                        >
                                            <Globe className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Public</p>
                                            <p className="mt-1 text-sm text-zinc-400">
                                                Anyone can view this repository.
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, isPrivate: true })
                                    }
                                    className={`rounded-xl border p-4 text-left transition ${formData.isPrivate
                                        ? "border-blue-500/40 bg-blue-500/10"
                                        : "border-white/10 bg-black/10 hover:bg-white/5"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`mt-0.5 rounded-lg p-2 ${formData.isPrivate
                                                ? "bg-blue-500/15 text-blue-400"
                                                : "bg-white/5 text-zinc-400"
                                                }`}
                                        >
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Private</p>
                                            <p className="mt-1 text-sm text-zinc-400">
                                                Only you and invited members can access it.
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* footer actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="border-white/10 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="bg-blue-600 text-white hover:bg-blue-500"
                            >
                                Create Repository
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}