"use client"

import { signOut } from "next-auth/react"
import { Button } from "@nextui-org/button";
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "./ui/menubar"
import { LogOut, Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"

const UserAccountNav = () => {

    const DisconnectUser = dynamic(() => import('@/components/DisconnectUser'), {
        ssr: false,
    })

    const { data: session } = useSession();
    const { theme, systemTheme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    const handleThemeSwitch = () => { currentTheme === "dark" ? setTheme("light") : setTheme("dark") }

    return (
        <div className="flex justify-center item-center">
            <div className="flex items-center md:hidden">
                <DisconnectUser />
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
                                Dark mode
                                {currentTheme === "dark" ? <Sun onClick={handleThemeSwitch} /> : <Moon onClick={handleThemeSwitch} />}
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
                <Link href={`/profile/${session?.user.id}`}><Button color="primary" radius="sm">Profil</Button></Link>
                <Button onClick={() => signOut({
                    redirect: true,
                    callbackUrl: `${window.location.origin}/login`
                })} color="danger" radius="sm">Deconnexion</Button>
            </div>
        </div>
    )
}

export default UserAccountNav;