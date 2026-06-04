"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ServiceManager } from "@/src/services/api.serviceManager";
import toast from "react-hot-toast";

export default function Signup() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();

        const payload = {
            user_name: formData.username,
            email: formData.email,
            password: formData.password
        }

        const res: any = await ServiceManager.signup(payload)
        console.log(res)
        if (res?.success) {
            toast.success("Account created successfully")
            router.push("/login")
        } else {
            toast.error(res?.message)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1117] px-4">
            {/* Subtle background glow */}
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/5 bg-zinc-900/80 p-8 shadow-xl backdrop-blur-xl">
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Create Account
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Join us and start your journey
                    </p>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-5" onSubmit={handleSignup} >
                    {/* Username */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="text-sm font-medium text-zinc-300">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                type="text"
                                placeholder="johndoe"
                                className="h-11 border-white/10 bg-zinc-950/50 pl-10 text-white placeholder:text-zinc-500 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                type="email"
                                placeholder="you@example.com"
                                className="h-11 border-white/10 bg-zinc-950/50 pl-10 text-white placeholder:text-zinc-500 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <Input
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="h-11 border-white/10 bg-zinc-950/50 pl-10 pr-10 text-white placeholder:text-zinc-500 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="group h-11 w-full rounded-xl bg-blue-600 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/30 active:scale-[0.98]"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Get Started
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-zinc-400">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="font-semibold text-white transition-colors hover:text-blue-400 hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}