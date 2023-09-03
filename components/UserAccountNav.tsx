"use client"

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"

const UserAccountNav = () => {
    return (
        <Button onClick={() => signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}/login`
        })} variant="destructive">Deconnexion</Button>
    )
}

export default UserAccountNav;