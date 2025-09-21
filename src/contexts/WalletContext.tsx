import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface WalletContextType {
  isConnected: boolean;
  accountId: string | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (toAccountId: string, amount: number) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

declare global {
  interface Window {
    hashpack?: {
      connectToLocalWallet?: () => Promise<any>;
      connect?: () => Promise<any>;
      requestAccountInfo?: () => Promise<any>;
      requestAccounts?: () => Promise<{ accounts?: string[] }>;
      makeBytes?: (transaction: any, accountId: string) => Promise<any>;
      disconnect?: () => void;
    };
    hashconnect?: any;
    hedera?: any;
    __detectWalletGlobals?: () => any;
  }
}

const POLL_INTERVAL = 300;
const POLL_TIMEOUT = 10_000;

async function waitForWalletInjection(timeout = POLL_TIMEOUT) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (typeof window === 'undefined') return false;
    if (typeof window.hashpack !== 'undefined' || typeof window.hashconnect !== 'undefined' || typeof window.hedera !== 'undefined') {
      return true;
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }
  return false;
}

/* Runtime helper (call from browser console) */
if (typeof window !== 'undefined') {
  window.__detectWalletGlobals = () => {
    const keys = Object.keys(window).filter((k) => /hash|hedera|hashconnect/i.test(k));
    const sample: Record<string, any> = {};
    ['hashpack', 'hashconnect', 'hedera'].forEach((k) => (sample[k] = (window as any)[k]));
    console.info('[wallet-detect] matching window keys:', keys);
    console.info('[wallet-detect] sample values (don\'t paste secrets):', sample);
    return { keys, sample };
  };
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [walletAvailable, setWalletAvailable] = useState<boolean>(typeof window !== 'undefined' && Boolean((window as any).hashpack || (window as any).hashconnect || (window as any).hedera));

  const probeAccountInfo = useCallback(async (): Promise<{ accountId?: string; balance?: string } | null> => {
    if (typeof window === 'undefined') return null;

    try {
      if (window.hashpack?.requestAccountInfo) {
        const info = await window.hashpack.requestAccountInfo();
        if (info?.success && info?.data?.accountId) {
          const hb = info.data.balance?.hbars ?? info.data.balance ?? 0;
          return { accountId: info.data.accountId, balance: String(hb) };
        }
      }

      if (window.hashpack?.requestAccounts) {
        const accounts = await window.hashpack.requestAccounts();
        const acc = accounts?.accounts?.[0];
        if (acc) return { accountId: acc, balance: undefined };
      }

      // fallback checks for other providers
      const anyWin = window as any;
      const altAcc = anyWin?.hedera?.accountId || anyWin?.hashconnect?.pairedAccount || anyWin?.hashconnect?.accountId;
      if (altAcc) return { accountId: String(altAcc), balance: undefined };
    } catch (e) {
      // ignore probe errors
      console.debug('[WalletContext] probeAccountInfo error', e);
    }

    return null;
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('No window object');
      }

      // wait briefly for extension injection if not present
      if (!window.hashpack && !window.hashconnect && !window.hedera) {
        const found = await waitForWalletInjection();
        if (!found) {
          toast({
            title: "Wallet Not Found",
            description: "Please install or open a Hedera wallet (e.g. HashPack) and allow site access.",
            variant: "destructive",
          });
          setWalletAvailable(false);
          return;
        }
        setWalletAvailable(true);
      } else {
        setWalletAvailable(true);
      }

      // Try multiple connect flows for different provider shapes
      let connectResult: any = null;
      if (window.hashpack?.connectToLocalWallet) {
        connectResult = await window.hashpack.connectToLocalWallet();
      } else if (window.hashpack?.connect) {
        connectResult = await window.hashpack.connect();
      } else if (window.hashpack?.requestAccounts) {
        const accounts = await window.hashpack.requestAccounts();
        connectResult = { success: true, data: { accountIds: accounts.accounts } };
      }

      if (connectResult?.success && connectResult.data) {
        const primaryAccountId = connectResult.data.accountIds[0];
        setAccountId(primaryAccountId);
        setIsConnected(true);

        // Get account info including balance
        const accountInfo = await window.hashpack.requestAccountInfo();
        if (accountInfo.success && accountInfo.data) {
          setBalance(accountInfo.data.balance.hbars.toString());
        }

        toast({
          title: "Wallet Connected",
          description: `Connected to account: ${primaryAccountId}`,
        });
      } else {
        throw new Error(connectResult.message || 'Failed to connect wallet');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to HashPack wallet. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAccountId(null);
    setBalance(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  }, []);

  const sendTransaction = useCallback(async (toAccountId: string, amount: number): Promise<string | null> => {
    if (!isConnected || !accountId) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return null;
    }

    try {
      // This is a simplified transaction - in a real app you'd need proper transaction building
      toast({
        title: "Transaction Initiated",
        description: `Sending ${amount} HBAR to ${toAccountId}`,
      });

      // Return a mock transaction ID - in a real implementation, you'd interact with Hedera SDK
      return `0.0.${Math.floor(Math.random() * 1000000)}@${Date.now()}`;
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction Failed",
        description: "Failed to send transaction. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [isConnected, accountId]);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (window.hashpack) {
        try {
          const accountInfo = await window.hashpack.requestAccountInfo();
          if (accountInfo.success && accountInfo.data) {
            setAccountId(accountInfo.data.accountId);
            setBalance(accountInfo.data.balance.hbars.toString());
            setIsConnected(true);
          }
        } catch (error) {
          // Silently fail - wallet not connected
        }
      }
    };

    checkExistingConnection();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        accountId,
        balance,
        connectWallet,
        disconnectWallet,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};