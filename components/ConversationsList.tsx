"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";

const ConversationsList = ({ convData, session }: { convData: any, session: any }) => {

    const router = useRouter();

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
                {convData.map((conv: any) => (
                    <TableRow onClick={() => {
                        router.push(`/messages/${session?.user.id === conv.userOneId ? conv.userTwo.id : conv.userOne.id}`)
                    }}>
                        <TableCell className="font-medium flex flex-row items-center gap-2">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={session?.user.id === conv.userOneId ? conv.userTwo.profile.imageUrl : conv.userOne.profile.imageUrl} />
                                <AvatarFallback>{session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}</AvatarFallback>
                            </Avatar>{session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}
                        </TableCell>
                        <TableCell>
                            {session?.user.id === conv.userOneId ? conv.userTwo.username : conv.userOne.username}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ConversationsList;