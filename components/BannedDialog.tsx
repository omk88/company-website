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

interface BannedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banDetails: BanDetails | null;
}

export function BannedDialog({ open, onOpenChange, banDetails }: BannedDialogProps) {
  if (!banDetails) return null;

  const formattedBannedAt = banDetails.bannedAt
    ? new Date(banDetails.bannedAt).toLocaleString()
    : "N/A";

  const formattedBannedUntil = banDetails.bannedUntil
    ? new Date(banDetails.bannedUntil).toLocaleString()
    : "Indefinitely";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Account Suspended</DialogTitle>
          <DialogDescription>
            Your account is restricted from performing this action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm mt-2">
          <div>
            <span className="font-semibold text-gray-500 block">Reason:</span>
            <p className="text-gray-900 font-medium">{banDetails.banReason}</p>
          </div>

          {banDetails.banViolations.length > 0 && (
            <div>
              <span className="font-semibold text-gray-500 block">Violations:</span>
              <ul className="list-disc list-inside text-red-600">
                {banDetails.banViolations.map((violation, idx) => (
                  <li key={idx}>{violation}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div>
              <span className="font-semibold text-xs text-gray-400">Issued On:</span>
              <p className="text-xs text-gray-700">{formattedBannedAt}</p>
            </div>
            <div>
              <span className="font-semibold text-xs text-gray-400">Expires:</span>
              <p className="text-xs text-gray-700">{formattedBannedUntil}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}