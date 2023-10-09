"use client"

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"

const UserAccountNav = () => {

    const { data: session } = useSession();

    return (
        <div className="flex gap-8">
            <Link href={`/profile/${session?.user.id}`}><Button>Profil</Button></Link>
            <Button onClick={() => signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/login`
            })} variant="destructive">Deconnexion</Button>
        </div>
    )
}

export default UserAccountNav;