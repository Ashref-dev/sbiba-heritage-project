"use client";

import { createContext, useState, ReactNode } from "react";

interface ModalContextType {
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
}

const initialModalContext: ModalContextType = {
  showSignInModal: false,
  setShowSignInModal: () => {},
};

export const ModalContext = createContext<ModalContextType>(initialModalContext);

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        showSignInModal,
        setShowSignInModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
} 