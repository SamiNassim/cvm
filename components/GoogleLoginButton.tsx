import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface GoogleLoginButtonProps {
    children: ReactNode;
}

const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({ children }) => {

    function loginWithGoogle() {

        // Change URL for production
        signIn("google", {
            callbackUrl: "http://localhost:3000/admin"
        })
    }

    return (
        <Button onClick={loginWithGoogle} className="w-full">{children}</Button>
    )
}

export default GoogleLoginButton;