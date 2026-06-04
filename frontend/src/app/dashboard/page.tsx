'use client'

import Link from "next/link";

import {
    FolderGit2,
    GitBranch,
    GitCommitHorizontal,
    Plus,
    Search,
    Bell,
    User,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ServiceManager } from "@/src/services/api.serviceManager";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {

    const router = useRouter()
    const [repositories, setRepositories] = useState([])

    const fetchRepositories = async () => {
        try {
            const res = await ServiceManager.getRepositories()
            if (res?.success) {
                setRepositories(res?.data)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchRepositories()
    }, [])

    return (
        <div className="min-h-screen  text-white">

            {/* content */}
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">

                {/* top section */}
                <section className="flex flex-col gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <h2 className="text-4xl font-bold tracking-tight">
                            Welcome back 👋
                        </h2>

                        <p className="mt-3 max-w-2xl text-zinc-400">
                            Manage repositories, branches and commits from your
                            custom Git platform.
                        </p>

                    </div>

                    <Button className="h-12 rounded-xl bg-white px-6 text-black hover:bg-zinc-200" onClick={() => { router.push('/repository/create') }}>
                        <Plus className="mr-2 size-4" />
                        Create Repository
                    </Button>

                </section>

                {/* stats */}
                <section className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-500">
                                    Total Repositories
                                </p>
                                <h3 className="mt-2 text-3xl font-bold">
                                    12
                                </h3>
                            </div>
                            <FolderGit2 className="size-8 text-zinc-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-500">
                                    Total Branches
                                </p>

                                <h3 className="mt-2 text-3xl font-bold">
                                    48
                                </h3>
                            </div>
                            <GitBranch className="size-8 text-zinc-500" />

                        </div>

                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-zinc-500">
                                    Total Commits
                                </p>

                                <h3 className="mt-2 text-3xl font-bold">
                                    421
                                </h3>
                            </div>

                            <GitCommitHorizontal className="size-8 text-zinc-500" />

                        </div>

                    </div>

                </section>

                {/* repositories */}
                <section className="flex flex-col gap-5">

                    <div className="flex items-center justify-between">

                        <h2 className="text-2xl font-semibold">
                            Your Repositories
                        </h2>

                        <Button
                            variant="outline"
                            className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                        >
                            View All
                        </Button>

                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {repositories.map((repo: any) => (

                            <Link
                                key={repo.id}
                                href={`/repository/${repo.id}`}
                                className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900"
                            >

                                <div className="flex items-start justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950">
                                            <FolderGit2 className="size-5 text-zinc-300" />
                                        </div>

                                        <div>

                                            <h3 className="font-semibold transition-colors group-hover:text-blue-400">
                                                {repo.name}
                                            </h3>

                                            <p className="text-xs text-zinc-500">
                                                Public Repository
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                                    {repo.description}
                                </p>

                                <div className="mt-6 flex items-center gap-5 text-sm text-zinc-500">

                                    <div className="flex items-center gap-2">
                                        <GitBranch className="size-4" />
                                        {repo.branches}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <GitCommitHorizontal className="size-4" />
                                        {repo.commits}
                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}