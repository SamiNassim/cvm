"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";

const ConversationsList = ({ convData, session }: { convData: any, session: any }) => {

    const router = useRouter();


    // Specify a max length for the message to be truncated if it's too long
    const maxLength = 20;

    return (
        <Table>
            <TableCaption>Liste de vos conversations récentes.</TableCaption>
            {/*             <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader> */}
            <TableBody>
                {convData.map((conv: any, index: any) => (
                    <TableRow key={index} onClick={() => {
                        router.push(`/messages/${session?.user.id === conv.userOneId ? conv.userTwo.id : conv.userOne.id}`)
                    }}>
                        <TableCell className="font-medium flex flex-row items-center gap-2">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={session?.user.id === conv.userOneId ? conv.userTwo.profile.imageUrl : conv.userOne.profile.imageUrl} />
                                <AvatarFallback>{session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}</AvatarFallback>
                            </Avatar>{session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}
                        </TableCell>
                        <TableCell>
                            {conv.messages.map((lastmessage: any) => {
                                return lastmessage.content.length > maxLength ? lastmessage.content.substring(0, maxLength) + "..." : lastmessage.content
                            })}
                        </TableCell>
                        <TableCell>
                            {session?.user.id === conv.userOneId ? <Badge className={conv.userOneUnread === 0 ? "hidden" : ""} variant="destructive">{conv.userOneUnread}</Badge> : <Badge className={conv.userTwoUnread === 0 ? "hidden" : ""} variant="destructive">{conv.userTwoUnread}</Badge>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ConversationsList;