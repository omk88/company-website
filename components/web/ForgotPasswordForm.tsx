/*"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    
    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = async (data: { email: string }) => {
        setIsLoading(true);
        try {
            // Change authClient.forgetPassword to authClient.emailAndPassword.forgetPassword
            await authClient.({
                email: data.email,
                redirectTo: "/reset-password", 
            }, {
                onRequest: () => setIsLoading(true),
                onSuccess: () => {
                    setIsLoading(false);
                    toast.success("If an account exists, a reset link has been sent!");
                },
                onError: (ctx) => {
                    setIsLoading(false);
                    toast.error(ctx.error.message || "Something went wrong.");
                }
            });
        } catch (error) {
            setIsLoading(false);
            toast.error("An unexpected error occurred.");
        }
    };
    
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "Email is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Email Address</FieldLabel>
                                    <Input 
                                        aria-invalid={fieldState.invalid} 
                                        placeholder="john@doe.com" 
                                        type="email" 
                                        {...field}
                                    />
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                                    )}
                                </Field>
                            )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending link..." : "Send Reset Link"}
                        </Button>

                        <div className="text-center mt-2">
                            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                                Back to Sign In
                            </Link>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}*/