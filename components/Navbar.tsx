"use client"

import React, { useEffect, useState } from "react";
import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Badge } from "@nextui-org/badge";
import { FileEdit, Heart, LogOut, Mail, Moon, Sun, User } from "lucide-react";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

export default function NavbarNew(session: any) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const { theme, systemTheme, setTheme } = useTheme();

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const handleThemeSwitch = () => { currentTheme === "dark" ? setTheme("light") : setTheme("dark") }

    useEffect(() => {
        const unreadMessages = fetch("/api/messages/unread", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setUnreadMessages(data)
            })
            .catch(error => console.log("[UNREAD GET ERROR]", error))
    }, [])

    const goOffline = () => {

        fetch("/api/user/offline", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log("[OFFLINE PATCH ERROR]", error))

    }

    if (session && typeof window !== "undefined") {
        useEffect(() => {
            document.onvisibilitychange = () => {
                if (document.visibilityState === "hidden") {
                    goOffline()
                }
            };
            addEventListener("beforeunload", goOffline)

        }, [document.onvisibilitychange])
    }

    console.log("sesslog", session)

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link color="foreground" href={session?.session?.user ? ("/home") : ("/")}>
                        <Heart strokeWidth={1.5} />
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            {session?.session?.user ? (
                <><NavbarContent className="sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link color="foreground" href={"/messages"}>
                            <Badge className={unreadMessages === 0 ? "hidden" : ""} placement="top-right" content={unreadMessages} color="danger" shape="circle" size="md" showOutline={false}>
                                <Mail strokeWidth={1.5} />
                            </Badge>
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                    <NavbarContent justify="end">
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="secondary"
                                    name={session?.session.user.username}
                                    size="sm"
                                    src={session?.session.user.image} />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem href={`/profile/${session?.session.user.id}`} key="name" className="h-12 gap-2">
                                    <p className="font-semibold">{session?.session?.user.username}</p>
                                </DropdownItem>
                                <DropdownItem endContent={<User color="grey" />} key="profile" href={`/profile/${session?.session.user.id}`}>Profil</DropdownItem>
                                <DropdownItem endContent={<FileEdit color="grey" />} key="editprofile" href={`/profile/edit/${session?.session.user.id}`}>Modifier profil</DropdownItem>
                                <DropdownItem
                                    key="darkmode"
                                    closeOnSelect={false}
                                    onClick={() => handleThemeSwitch()}
                                    endContent={currentTheme === "dark" ?
                                        <Sun fill="grey" strokeWidth={0.5} onClick={() => handleThemeSwitch()} /> :
                                        <Moon fill="grey" strokeWidth={0.5} color="grey" onClick={() => handleThemeSwitch()} />}>Dark mode
                                </DropdownItem>
                                <DropdownItem endContent={<LogOut color="grey" />} key="logout" color="danger" onClick={() => signOut({
                                    redirect: true,
                                    callbackUrl: `${window.location.origin}/login`
                                })}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarContent></>) : (<NavbarContent justify="end">
                        <NavbarItem className="hidden lg:flex">
                            <Link href="/login">Login</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button as={Link} color="primary" href="#" variant="flat">
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </NavbarContent>)}

            <NavbarMenu>
                <NavbarMenuItem>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
}
