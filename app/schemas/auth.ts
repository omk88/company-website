import z from 'zod';

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(30),
  confirmpassword: z.string().min(1), 
})
.refine((data) => data.password === data.confirmpassword, {
  message: "Passwords do not match",
  path: ["confirmpassword"],
});

 export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(30)
 });