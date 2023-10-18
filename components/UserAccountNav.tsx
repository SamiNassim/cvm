"use client"

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "./ui/menubar"
import { LogOut, Mail, Menu } from "lucide-react"
import { Switch } from "./ui/switch"
import { useTheme } from "next-themes"

const UserAccountNav = () => {

    const { data: session } = useSession();
    const { theme, systemTheme, setTheme } = useTheme();

    const currentTheme = theme === 'system' ? systemTheme : theme;


    return (
        <div className="flex justify-center item-center">
            <div className="flex items-center md:hidden">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger><Menu size={18} /></MenubarTrigger>
                        <MenubarContent>
                            <Link href={`/profile/${session?.user.id}`}><MenubarItem>
                                Profil
                            </MenubarItem></Link>
                            <MenubarItem>New Window</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="flex justify-between" onSelect={(e) => e.preventDefault()}>
                                Dark Mode
                                <Switch defaultChecked={currentTheme === "dark" ? true : false}
                                    onCheckedChange={() => currentTheme === "dark" ? setTheme("light") : setTheme("dark")} />
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={() => signOut({
                                redirect: true,
                                callbackUrl: `${window.location.origin}/login`
                            })}>Deconnexion <MenubarShortcut><LogOut /></MenubarShortcut></MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
            <div className="md:flex gap-8 hidden">
                <Link href={`/profile/${session?.user.id}`}><Button>Profil</Button></Link>
                <Button onClick={() => signOut({
                    redirect: true,
                    callbackUrl: `${window.location.origin}/login`
                })} variant="destructive">Deconnexion</Button>
            </div>
        </div>
    )
}

export default UserAccountNav;