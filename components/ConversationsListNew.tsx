"use client"

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { User } from "@nextui-org/user";
import { ChipProps } from "@nextui-org/chip";
import { Skeleton } from "@nextui-org/skeleton";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

export default function ConversationsList({ convData, session }: { convData: any, session: any }) {

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
                            <TableRow className="flex items-center justify-between" data-hover key={index} onClick={() => {
                                router.push(`/messages/${session?.user.id === conv.userOneId ? conv.userTwo.id : conv.userOne.id}`)
                            }}>
                                <TableCell className="flex">
                                    {session?.user.id === conv.userOneId ?
                                        <User
                                            name={session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}
                                            description={conv.userTwo.profile.region}
                                            avatarProps={{
                                                color: conv.userTwo.isOnline ? "success" : "default",
                                                src: session?.user.id === conv.userOneId ? conv.userTwo.profile.imageUrl : conv.userOne.profile.imageUrl
                                            }}
                                        /> :
                                        <User
                                            name={session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}
                                            description={conv.userOne.profile.region}
                                            avatarProps={{
                                                isBordered: true,
                                                color: conv.userOne.isOnline ? "success" : "default",
                                                src: session?.user.id === conv.userOneId ? conv.userTwo.profile.imageUrl : conv.userOne.profile.imageUrl
                                            }}
                                        />}
                                </TableCell>
                                <TableCell>
                                    {conv.messages.map((lastmessage: any) => {
                                        return lastmessage.content.length > MAX_LENGTH ? <div className="flex justify-start">{lastmessage.content.substring(0, MAX_LENGTH) + "..."}</div> : <div className="flex justify-start">{lastmessage.content}</div>;
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
