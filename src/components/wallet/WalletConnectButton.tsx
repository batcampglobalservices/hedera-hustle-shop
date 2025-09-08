import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, LogOut } from "lucide-react";

export const WalletConnectButton = () => {
  const { isConnected, accountId, balance, connectWallet, disconnectWallet } = useWallet();

  if (isConnected && accountId) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <Badge variant="secondary" className="text-xs">
            {accountId}
          </Badge>
          {balance && (
            <span className="text-xs text-muted-foreground">
              {balance} HBAR
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      className="flex items-center gap-2"
      variant="default"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
};