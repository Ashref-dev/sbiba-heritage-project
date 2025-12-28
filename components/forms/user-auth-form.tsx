"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UserAuthForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    try {
      const result = await signIn("nodemailer", {
        email,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Failed to send login email", {
          description:
            "Please try again or contact support if the issue persists.",
          icon: <AlertCircle className="size-5 text-red-500" />,
        });
      } else {
        toast.success("Magic link sent!", {
          description: `We've sent a login link to ${email}. Please check your inbox.`,
          icon: <CheckCircle className="size-5 text-green-500" />,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
        icon: <AlertCircle className="size-5 text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <Button
        onClick={handleSubmit}
        className="bg-gradient w-full transition-all duration-300 hover:scale-105"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending magic link...
          </>
        ) : (
          "Sign in with Email"
        )}
      </Button>
    </div>
  );
}
