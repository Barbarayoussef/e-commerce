"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(30, "Password must be at most 30 characters."),
});

export default function Login() {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified! You can now login.");
    }
    if (searchParams.get("error") === "link-expired") {
      toast.error("Verification link expired. Please register again.");
    }
    if (searchParams.get("error") === "link-expired") {
      toast.error("Verification link expired.", {
        description: "Please request a new verification email.",
        duration: 8000,
        action: {
          label: "Resend",
          onClick: () => (window.location.href = "/resend-verification"),
        },
      });
    }
  }, [searchParams]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }); //res has ok
    if (res?.ok) {
      toast.success("Login successful");
      window.location.href = "/";
    } else {
      toast.error(res?.error);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full sm:max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login here</CardTitle>{" "}
          <CardDescription>
            Welcome back! login to start shopping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="example@gmail.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="*******"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t-0">
          <Button type="submit" form="form-rhf-demo" className="w-full">
            Login
          </Button>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline text-center"
          >
            Forgot your password?
          </Link>
          <p className="text-sm text-center text-muted-foreground">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm text-center text-muted-foreground">
            Did not receive verification email?{" "}
            <Link
              href="/resend-verification"
              className="text-primary hover:underline font-medium"
            >
              Resend
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
