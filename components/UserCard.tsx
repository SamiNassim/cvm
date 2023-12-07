import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface UserCardProps {
    userId: string,
    name: string | null,
    imageUrl: string,
    country: string | null,
    region: string | null,
    gender: string | null,
    dob: string | null,
}

const UserCard = ({
    userId,
    name,
    imageUrl,
    country,
    region,
    gender,
    dob }: UserCardProps) => {

    function getAge(dateString: string) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const userAge = getAge(dob!);

    return (
        <Link href={`/profile/${userId}`}>
            <Card className="dark:bg-[#18191b]">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src={imageUrl} />
                        <AvatarFallback>{name}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">

                        <CardTitle className="flex flex-row items-center gap-2">
                            {name}{gender === "Homme" ? <p className="text-blue-500 text-sm">♂</p> : <p className="text-pink-500 text-sm">♀</p>}
                        </CardTitle>

                        <CardDescription>{userAge} ans</CardDescription>
                        <CardDescription className="text-sm">{country}</CardDescription>
                        <CardDescription className="text-sm">{region}</CardDescription>
                    </div>
                </CardHeader>
                {/*             <CardContent>
                
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
            </Card>
        </Link>
    )
}

export default UserCard;