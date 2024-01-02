"use client"

import React, { useEffect, useState } from "react";
import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Badge } from "@nextui-org/badge";
import { Heart, Mail } from "lucide-react";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import { signOut } from "next-auth/react";

export default function NavbarNew(session: any) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0)

    console.log(session.session)

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
            .catch(error => console.log("[OFFLINE PUT ERROR]", error))
    }, [])

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
                                <DropdownItem key="profile" className="h-12 gap-2">
                                    <p className="font-semibold">{session?.session?.user.username}</p>
                                </DropdownItem>
                                <DropdownItem key="profile" href={`/profile/${session?.session.user.id}`}>Profil</DropdownItem>
                                <DropdownItem key="logout" color="danger" onClick={() => signOut({
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