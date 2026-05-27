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

const formSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must contain at least one uppercase letter and one number",
    ),
});

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "", newPassword: "" },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`, {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      })
      .then((res) => {
        toast.success("Password reset successful!", { duration: 5000 });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch((err) => {
        if (
          err.response?.data?.message &&
          Array.isArray(err.response.data.message)
        ) {
          err.response.data.message.forEach((e: any) => toast.error(e.message));
        } else {
          toast.error(err.response?.data?.message || "Something went wrong.");
        }
      });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full sm:max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Enter the OTP sent to {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="reset-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="otp"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>OTP Code</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      placeholder="123456"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>New Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
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
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" form="reset-form" className="w-full">
            Reset Password
          </Button>
          <Link
            href="/login"
            className="text-sm text-primary hover:underline text-center"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
