'use client'

import { useRouter } from "next/navigation"

export default function RepositoryPage() {
    const router = useRouter()
    router.push('/dashboard')
    return (
        <div>
            <h1>Repository</h1>
        </div>
    )
}