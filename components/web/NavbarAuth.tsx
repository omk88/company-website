import { NavbarAuthClient } from "./NavbarAuthClient";
import { isAuthenticated } from "@/lib/auth-server";

export async function NavbarAuth() {
    const userIsAuthenticated = await isAuthenticated();
    return <NavbarAuthClient initialIsAuth={userIsAuthenticated} />;
}