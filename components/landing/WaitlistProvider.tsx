"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import WaitlistModal from "./WaitlistModal";

interface WaitlistContextValue {
  openWaitlistModal: () => void;
}

const WaitlistContext = createContext<WaitlistContextValue>({
  openWaitlistModal: () => {},
});

export function useWaitlistModal() {
  return useContext(WaitlistContext);
}

export default function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openWaitlistModal = useCallback(() => setIsOpen(true), []);
  const closeWaitlistModal = useCallback(() => setIsOpen(false), []);

  return (
    <WaitlistContext.Provider value={{ openWaitlistModal }}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={closeWaitlistModal} />
    </WaitlistContext.Provider>
  );
}
