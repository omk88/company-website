"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BanDetails {
  banReason: string;
  banViolations: string[];
  bannedAt: number | null;
  bannedUntil: number | null;
}

interface BanContextType {
  showBanDialog: (details: BanDetails) => void;
}

const BanContext = createContext<BanContextType | null>(null);

export function BanProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [banDetails, setBanDetails] = useState<BanDetails | null>(null);

  const showBanDialog = (details: BanDetails) => {
    setBanDetails(details);
    setIsOpen(true);
  };

  return (
    <BanContext.Provider value={{ showBanDialog }}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Account Suspended</DialogTitle>
            <DialogDescription>
              Your account is restricted from performing this action.
            </DialogDescription>
          </DialogHeader>

          {banDetails && (
            <div className="space-y-4 text-sm mt-2">
              <div>
                <span className="font-semibold text-gray-500 block">Reason:</span>
                <p className="text-gray-900 font-medium">{banDetails.banReason}</p>
              </div>

              {banDetails.banViolations.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-500 block">Violations:</span>
                  <ul className="list-disc list-inside text-red-600">
                    {banDetails.banViolations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div>
                  <span className="font-semibold text-xs text-gray-400">Issued:</span>
                  <p className="text-xs text-gray-700">
                    {banDetails.bannedAt ? new Date(banDetails.bannedAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-xs text-gray-400">Expires:</span>
                  <p className="text-xs text-gray-700">
                    {banDetails.bannedUntil ? new Date(banDetails.bannedUntil).toLocaleDateString() : "Indefinitely"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </BanContext.Provider>
  );
}

export const useBanModal = () => {
  const context = useContext(BanContext);
  if (!context) throw new Error("useBanModal must be used within a BanProvider");
  return context;
};