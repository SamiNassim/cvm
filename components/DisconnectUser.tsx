import { useEffect } from "react";

const DisconnectUser = () => {

    useEffect(() => {
        console.log("Useeffect works");

        const goOffline = () => {

            fetch("/api/user/offline", { method: "PUT", headers: { "Content-Type": "application/json" } })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log("[OFFLINE PUT ERROR]", error))

        }

        document.onvisibilitychange = () => {
            if (document.visibilityState === "hidden") {
                goOffline()
            }
        };

    }, [document.onvisibilitychange])
    return (
        <></>
    )
}

export default DisconnectUser;