"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import axios from "axios";
import Link from "next/link";
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
  email: z.string().email("Invalid email address."),
});

export default function ResendVerification() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/resend-verification`,
        data,
      )
      .then((res) => {
        toast.success("Verification email sent!", {
          description: "Please check your inbox and verify your account.",
          duration: 8000,
        });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong.");
      });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full sm:max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Resend Verification
          </CardTitle>
          <CardDescription>
            Enter your email to resend the verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="resend-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@gmail.com"
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
          <Button type="submit" form="resend-form" className="w-full">
            Resend Email
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
