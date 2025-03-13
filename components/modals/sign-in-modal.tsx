"use client";

import { useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModalContext } from "@/components/modals/providers";

export function SignInModal() {
  const { showSignInModal, setShowSignInModal } = useContext(ModalContext);

  return (
    <Dialog open={showSignInModal} onOpenChange={setShowSignInModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          {/* Add your sign-in form or authentication providers here */}
          <p className="text-center text-sm text-muted-foreground">
            Sign in to access all features
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 