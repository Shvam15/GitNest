'use client'

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ServiceManager } from "@/src/services/api.serviceManager";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const res: any = await ServiceManager.login(formData)
        if (res?.success) {
            toast.success("Login successful")
            localStorage.setItem("token", res?.data?.accessToken)
            localStorage.setItem("user", JSON.stringify(res?.data?.safeUser))
            router.push("/dashboard")
        } else {
            toast.error(res?.message)
        }
        setIsLoading(false);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0A] px-4 py-12">
            {/* Animated background gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 blur-md" />

                <form
                    onSubmit={handleSubmit}
                    className="relative flex w-full flex-col gap-6 rounded-2xl border border-white/10 bg-zinc-950/80 p-8 backdrop-blur-xl shadow-2xl"
                >
                    {/* Logo / Brand */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                Welcome back
                            </h1>
                            <p className="mt-1 text-sm text-zinc-400">
                                Log in to continue to your dashboard
                            </p>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                            Email
                        </Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-400" />
                            <Input
                                id="email"
                                type="email"
                                value= {formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500 transition-all focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
                                Password
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-400" />
                            <Input
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="h-11 border-white/10 bg-white/5 pl-10 pr-10 text-white placeholder:text-zinc-500 transition-all focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-sm text-zinc-400 cursor-pointer select-none">
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="group relative h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {/* Shine effect */}
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                        <span className="relative flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </span>
                    </Button>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-zinc-400">
                        Don't have an account?{' '}
                        <Link
                            href="/signup"
                            className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
                        >
                            Create account
                        </Link>
                    </p>
                </form>

                {/* Bottom info */}
                <p className="mt-6 text-center text-xs text-zinc-500">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-zinc-400 hover:text-zinc-300 underline-offset-4 hover:underline">
                        Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-zinc-400 hover:text-zinc-300 underline-offset-4 hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}