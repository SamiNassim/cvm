"use client"

import { useEffect, useState } from "react";
import UserCard from "./user-card";
import axios from "axios";
import { CircularProgress } from "@nextui-org/progress";

const Homepage = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState([]);

    const getUsers = async () => {
        const response = await axios.get('/api/profile');
        console.log(response.data);
        setUserData(response.data.getProfileById);
    }

    useEffect(() => {
        setIsLoading(true)
        getUsers()
        setIsLoading(false)
    }, [])


    return (

        <div className='flex flex-col pt-[70px] h-1/2 items-center'>
            <h1 className="mb-4">Derniers membres inscrits</h1>
            <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
                {isLoading ? <div className="flex items-center w-full h-full"><CircularProgress color="primary" size="lg" aria-label="Loading..." /></div> :
                    userData.map((userInfo: any) => {
                        return (
                            <UserCard
                                key={userInfo.id}
                                userId={userInfo.userId}
                                name={userInfo.name}
                                imageUrl={userInfo.imageUrl}
                                gender={userInfo.gender}
                                country={userInfo.country}
                                region={userInfo.region}
                                dob={userInfo.dob}
                                isOnline={userInfo.users[0].isOnline}
                                bio={userInfo.bio}
                            />
                        )
                    })
                }
            </div>
        </div>
    )

}

export default Homepage;