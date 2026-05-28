import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SignUpForm from "@/components/web/SignUpForm";
import SignInForm from "@/components/web/SignInForm";


export default function SignIn() {
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Tabs defaultValue="signup" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="signup">Sign up</TabsTrigger>
                    <TabsTrigger value="signin">Sign in</TabsTrigger>
                </TabsList>
                <TabsContent value="signup"><SignUpForm /></TabsContent>
                <TabsContent value="signin"><SignInForm /></TabsContent>
            </Tabs>
        </div>
    );
}