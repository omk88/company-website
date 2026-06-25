import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SignUpForm from "@/components/web/SignUpForm";
import SignInForm from "@/components/web/SignInForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
// import ForgotPasswordForm from "@/components/web/ForgotPasswordForm";

export default function SignIn() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-[400px] flex flex-col items-start gap-4">
                <Link className={buttonVariants({variant: "outline"})} href="/">
                    <ArrowLeft className="size-4 mr-2" />
                    Back to home page
                </Link>

                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="signup">Sign up</TabsTrigger>
                        <TabsTrigger value="signin">Sign in</TabsTrigger>
                        {/* <TabsTrigger value="forgotpassword">Forgot password</TabsTrigger> */}
                    </TabsList>
                    <div className="min-h-[510px] flex flex-col justify-start mt-4">
                        <TabsContent value="signup"><SignUpForm /></TabsContent>
                        <TabsContent value="signin"><SignInForm /></TabsContent>
                        {/* <TabsContent value="forgotpassword"><ForgotPasswordForm /></TabsContent> */}
                    </div>
                </Tabs>
                
            </div>
        </div>
    );
}