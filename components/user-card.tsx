import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { getAge } from "@/lib/age-calculator";

interface UserCardProps {
    userId: string,
    name: string | null,
    imageUrl: string,
    country: string | null,
    region: string | null,
    gender: string | null,
    dob: string | null,
    isOnline: boolean,
    bio: string
}

export default function UserCard({
    userId,
    name,
    imageUrl,
    country,
    region,
    gender,
    dob,
    isOnline,
    bio }: UserCardProps) {

    const userAge = getAge(dob!);

    return (
        <Link href={`/profile/${userId}`}>
            <Card className="max-w-[340px]">
                <CardHeader className="justify-between items-start gap-5">
                    <div className="flex gap-5">
                        <Avatar isBordered color={isOnline ? "success" : "default"} radius="full" size="md" src={imageUrl} />
                        <div className="flex flex-col items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">{name}</h4>
                            <h5 className="text-xs tracking-tight text-default-400">{userAge} ans</h5>
                            <h6 className="text-small tracking-tight text-default-400">{country}</h6>
                            <h6 className="text-small tracking-tight text-default-400">{region}</h6>
                        </div>
                    </div>
                    <Button
                        isIconOnly
                        className=""
                        color="secondary"
                        radius="full"
                        size="sm"
                    >
                        {gender === "Homme" ? <p className="text-blue-500 text-sm">♂</p> : <p className="text-pink-500 text-sm">♀</p>}
                    </Button>
                </CardHeader>
                <CardBody className="px-3 pt-0 pb-3 text-small text-default-400">
                    <p className="flex-">
                        {bio}
                    </p>
                </CardBody>
            </Card>
        </Link>
    );
}
