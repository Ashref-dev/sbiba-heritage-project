"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  useEffect(() => {
    // Log the error for debugging
    if (error) {
      console.error("Authentication error:", error);
    }
  }, [error]);

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "AccessDenied":
        return "Access denied. You don't have permission to access this resource.";
      case "Verification":
        return "The verification link is invalid or has expired. Please request a new one.";
      case "OAuthSignin":
        return "Error in the OAuth sign-in process. Please try again.";
      case "OAuthCallback":
        return "Error in the OAuth callback process. Please try again.";
      case "OAuthCreateAccount":
        return "Could not create an OAuth account. Please try again.";
      case "EmailCreateAccount":
        return "Could not create an account using email. Please try again.";
      case "Callback":
        return "Error in the authentication callback. Please try again.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in using your original provider.";
      case "EmailSignin":
        return "Error sending the verification email. Please try again.";
      case "CredentialsSignin":
        return "Invalid credentials. Please check your email and try again.";
      case "SessionRequired":
        return "You must be signed in to access this page.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <div className="bg-dot-pattern relative mt-20 min-h-screen w-full flex-col items-center justify-center">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      <div className="relative mx-auto flex w-full flex-col items-center justify-center px-6 py-16 sm:px-8">
        <div className="mb-12 flex flex-col items-center">
          <div className="relative">
            <div className="bg-gradient absolute -inset-1 animate-ping rounded-full opacity-30" />
            <div className="relative rounded-full bg-background p-4 shadow-lg">
              <AlertCircle className="text-red-500 h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col space-y-3 text-center">
            <h1 className="text-gradient text-4xl font-bold tracking-tighter">
              Authentication Error
            </h1>
            <p className="text-sm text-muted-foreground">
              There was a problem with the authentication process
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-lg">
            <div className="space-y-4">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error Details</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{getErrorMessage(error)}</p>
                      {process.env.NODE_ENV !== "production" && error && (
                        <p className="mt-2 text-xs text-gray-500">Error code: {error}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link href="/sign-in">
                  <Button variant="outline" className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 