import { getServerAuth } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function Messaging() {

    const user = await getServerAuth();

    if (!user.isAuth) { 
        redirect("/sign-in");
    }

    return (
        <div>
            <span>Hello</span>
        </div>
    )
}