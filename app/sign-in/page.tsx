import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SignUpForm from "@/components/web/SignUpForm";
import SignInForm from "@/components/web/SignInForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] flex flex-col items-start gap-4">
        <div>
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            <ArrowLeft className="size-4 mr-2" />
            Back to home page
          </Link>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger 
              value="signup" 
              className="data-[state=inactive]:cursor-pointer data-[state=active]:cursor-default"
            >
              Sign up
            </TabsTrigger>
            <TabsTrigger 
              value="signin" 
              className="data-[state=inactive]:cursor-pointer data-[state=active]:cursor-default"
            >
              Sign in
            </TabsTrigger>
          </TabsList>
          <div className="min-h-[570px] flex flex-col justify-start mt-4">
            <TabsContent value="signup"><SignUpForm /></TabsContent>
            <TabsContent value="signin"><SignInForm /></TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}