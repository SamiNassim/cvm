"use client"

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { User } from "@nextui-org/user";
import { Chip, ChipProps } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { Skeleton } from "@nextui-org/skeleton";
import { Badge as BadgeUI } from "@nextui-org/badge";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { Avatar } from "@nextui-org/avatar";

/* import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { columns, users } from "./data"; */

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

export default function ConversationsListNew({ convData, session }: { convData: any, session: any }) {

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setIsLoading(false)
    }, [])

    const router = useRouter();

    const MAX_LENGTH = 20;

    return (
        <div className="flex justify-center items-center w-full">
            <Skeleton isLoaded={!isLoading} className="w-full">
                <Table hideHeader aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>AVATAR</TableColumn>
                        <TableColumn>LASTMESSAGE</TableColumn>
                        <TableColumn>UNREADMESSAGES</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {convData.map((conv: any, index: any) => (
                            <TableRow data-hover key={index} onClick={() => {
                                router.push(`/messages/${session?.user.id === conv.userOneId ? conv.userTwo.id : conv.userOne.id}`)
                            }}>
                                <TableCell className="flex justify-center">
                                    {session?.user.id === conv.userOneId ?
                                        <User
                                            name={session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}
                                            description="Product Designer"
                                            avatarProps={{
                                                color: conv.userTwo.isOnline ? "success" : "default",
                                                src: session?.user.id === conv.userOneId ? conv.userTwo.profile.imageUrl : conv.userOne.profile.imageUrl
                                            }}
                                        /> :
                                        <User
                                            name={session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}
                                            description="Product Designer"
                                            avatarProps={{
                                                isBordered: true,
                                                color: conv.userOne.isOnline ? "success" : "default",
                                                src: session?.user.id === conv.userOneId ? conv.userTwo.profile.imageUrl : conv.userOne.profile.imageUrl
                                            }}
                                        />}
                                </TableCell>
                                <TableCell>
                                    {conv.messages.map((lastmessage: any) => {
                                        return lastmessage.content.length > MAX_LENGTH ? lastmessage.content.substring(0, MAX_LENGTH) + "..." : lastmessage.content;
                                    })}
                                </TableCell>
                                <TableCell>
                                    {session?.user.id === conv.userOneId ? <Badge className={conv.userOneUnread === 0 ? "hidden" : ""} variant="destructive">{conv.userOneUnread}</Badge> : <Badge className={conv.userTwoUnread === 0 ? "hidden" : ""} variant="destructive">{conv.userTwoUnread}</Badge>}
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table >
            </Skeleton>
        </div>
    );
}
