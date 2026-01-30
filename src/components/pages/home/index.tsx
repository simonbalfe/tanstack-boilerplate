"use client"
import { useUser } from "@/src/hooks/use-user"
import { useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { Spinner } from "@/src/components/ui/spinner"

export function HomePage() {
    const navigate = useNavigate()
    const { user, loading } = useUser()

    useEffect(() => {
        if (!loading) {
            if (user) {
                void navigate({ to: "/dashboard" })
            } else {
                void navigate({ to: "/auth" })
            }
        }
    }, [user, loading, navigate])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Spinner className="h-8 w-8 text-primary" />
        </div>
    )
}
