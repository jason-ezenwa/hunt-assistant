import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/auth-client";
import {
  signUpSchema,
  type SignUpFormData,
} from "@/lib/validations/auth.schemas";
import AuthLayout from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  //   try {
  //     const { error } = await authClient.signIn.social({
  //       provider: "google",
  //       callbackURL: "/dashboard",
  //     });

  //     if (error) {
  //       console.error("Google sign-up error:", error);
  //       toast.error("Google sign-up failed");
  //     }
  //   } catch (error) {
  //     console.error("Google sign-up error:", error);
  //     toast.error("An unexpected error occurred");
  //   }
  // };

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Signup failed");
      } else {
        toast.success("Signup successful");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-center text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Get started with your job hunting assistant
        </p>
      </div>

      <div className="flex items-center mb-4 md:mb-6">
        <div className="flex-1 h-px bg-white/20"></div>
        <span className="px-2 md:px-3 text-muted-foreground text-xs md:text-sm font-normal">
          OR
        </span>
        <div className="flex-1 h-px bg-white/20"></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 h-auto text-sm">
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-primary hover:text-primary/80 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
