"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { authClient } from "@/lib/auth-client";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

export default function SignInForm() {
    const [isLoading, setIsLoading] = useState(false);
    
    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        }
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: "/", 
            }, {
                onRequest: () => setIsLoading(true),
                onSuccess: () => {
                    toast.success("Successfully signed in!");
                },
                onError: (ctx) => {
                    setIsLoading(false);
                    toast.error(ctx.error.message || "Invalid email or password.");
                }
            });
        } catch (error) {
            setIsLoading(false);
            toast.error("An unexpected error occurred.");
        }
    };

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Sign in to continue</CardDescription>
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
                                    <FieldLabel>Email</FieldLabel>
                                    <Input 
                                        aria-invalid={fieldState.invalid} 
                                        placeholder="john@doe.com" 
                                        type="email" 
                                        {...field}
                                    />
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Password is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input 
                                        aria-invalid={fieldState.invalid} 
                                        placeholder="********" 
                                        type="password" 
                                        {...field}
                                    />
                                </Field>
                            )}  
                        />

                        <div className="flex items-center justify-between pt-1 pb-2">
                            <Controller
                                name="rememberMe"
                                control={control}
                                render={({ field }) => (
                                    <Field orientation="horizontal" className="space-x-2">
                                        <Checkbox
                                            id="remember-me-checkbox"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <FieldLabel
                                            htmlFor="remember-me-checkbox"
                                            className="font-normal cursor-pointer select-none"
                                        >
                                            Remember me
                                        </FieldLabel>
                                    </Field>
                                )}
                            />

                            <Link
                                href="/forgot-password" 
                                className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-primary hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </FieldGroup>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                </Button>
            </CardContent>
        </Card>
    );
}