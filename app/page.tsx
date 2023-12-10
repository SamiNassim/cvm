import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function LandingPage() {

  const session = await getServerSession(authOptions);

  const userMessages = await db.message.findMany({
    where: {
      userId: session?.user.id
    }
  })

  console.log("[MESSAGESLOG]", userMessages.length);

  const onboardingCheck = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      onboarded: true,
    }
  })

  if (session && !onboardingCheck?.onboarded) {
    return redirect("/profile/edit")
  }

  return (
    <div>Landing page</div>
  )
}
