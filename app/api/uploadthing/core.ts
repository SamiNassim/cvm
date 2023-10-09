import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized")
    return { userId: session?.user.id }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    userImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    messageFile: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }, video: { maxFileSize: "128MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;