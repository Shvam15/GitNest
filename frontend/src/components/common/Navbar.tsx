'use client'

import Link from "next/link";

import {
    Bell,
    FolderGit2,
    Plus,
    Search,
    User,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const Navbar = () => {

    const router = useRouter()

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0d1117]/80 backdrop-blur-xl">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                {/* left */}
                <div className="flex items-center gap-8">

                    {/* logo */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-purple-900/50 bg-zinc-900 transition-colors hover:bg-zinc-800">

                            <Image src="/gitNest-logo-2.png" alt="Logo" width={400} height={400} className="w-full h-full" />

                        </div>

                        <div className="hidden sm:flex sm:flex-col">

                            <h1 className="text-sm font-semibold text-white">
                                GitNest
                            </h1>

                            <p className="text-xs text-zinc-500">
                                Developer Platform
                            </p>

                        </div>

                    </Link>

                    {/* search */}
                    <div className="relative hidden md:block">

                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

                        <Input
                            placeholder="Search repositories..."
                            className="h-10 w-[280px] rounded-xl border-zinc-700 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500"
                        />

                    </div>

                </div>

                {/* right */}
                <div className="flex items-center gap-3">

                    {/* create repo */}
                    <Button
                        className="hidden h-10 rounded-xl bg-white px-4 text-black hover:bg-zinc-200 md:flex"
                        onClick={() => { router.push('repository/create') }}
                    >
                        <Plus className="mr-2 size-4" />
                        New Repo
                    </Button>

                    {/* repos */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                    >

                        <FolderGit2 className="size-4 text-zinc-300" />

                    </Button>

                    {/* notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                    >

                        <Bell className="size-4 text-zinc-300" />

                    </Button>

                    {/* profile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                    >

                        <User className="size-4 text-zinc-300" />

                    </Button>

                </div>

            </div>

        </header>
    );
};