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
      connectToLocalWallet: () => Promise<{
        success: boolean;
        message: string;
        data?: {
          accountIds: string[];
          network: string;
        };
      }>;
      requestAccountInfo: () => Promise<{
        success: boolean;
        data?: {
          accountId: string;
          balance: {
            hbars: number;
          };
        };
      }>;
      makeBytes: (transaction: any, accountId: string) => Promise<{
        success: boolean;
        signedTransaction?: Uint8Array;
      }>;
    };
  }
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      // Check if HashPack is installed
      if (!window.hashpack) {
        toast({
          title: "Wallet Not Found",
          description: "Please install HashPack wallet to continue.",
          variant: "destructive",
        });
        return;
      }

      // Connect to HashPack
      const connectResult = await window.hashpack.connectToLocalWallet();
      
      if (connectResult.success && connectResult.data) {
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