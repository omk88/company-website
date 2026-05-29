import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server"; 
import { api } from "@/convex/_generated/api"; 
import { redirect } from "next/navigation";

export async function verifyCompanyUser() {
    const authed = await isAuthenticated();
    if (!authed) {
        redirect("/");
    }

    const user = await fetchAuthQuery(api.auth.getCurrentUser);
    
    const userEmail = user?.email || "";
    const companyDomain = "@taqtiq.tech";

    if (!user || !userEmail.endsWith(companyDomain)) {
        redirect("/");
    }

    return user;
}