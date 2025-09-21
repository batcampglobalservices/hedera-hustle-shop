import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

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
    ethereum?: any;
  }
}

export const WalletConnect: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connectHashpack = async () => {
    if (!window.hashpack) {
      toast({ title: 'HashPack not found', description: 'Install HashPack extension or open the wallet app.' });
      return;
    }

    try {
      // try common methods
      if (typeof window.hashpack.requestAccounts === 'function') {
        const res = await window.hashpack.requestAccounts();
        const acc = res?.accounts?.[0];
        setAccount(acc);
        setConnected(Boolean(acc));
        toast({ title: 'HashPack connected', description: String(acc) });
        return;
      }

      if (typeof window.hashpack.connect === 'function') {
        const res = await window.hashpack.connect();
        const acc = res?.data?.accountIds?.[0] || res?.accountId;
        setAccount(acc);
        setConnected(Boolean(acc));
        toast({ title: 'HashPack connected', description: String(acc) });
        return;
      }

      toast({ title: 'Unable to connect', description: 'HashPack connection API not found.' });
    } catch (e: any) {
      toast({ title: 'HashPack error', description: e.message || String(e), variant: 'destructive' });
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast({ title: 'MetaMask not found', description: 'Install MetaMask to connect.' });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const acc = accounts?.[0];
      setAccount(acc);
      setConnected(Boolean(acc));
      toast({ title: 'MetaMask connected', description: String(acc) });
    } catch (e: any) {
      toast({ title: 'MetaMask error', description: e.message || String(e), variant: 'destructive' });
    }
  };

  const autoDetectAndConnect = async () => {
    if (window.hashpack) return connectHashpack();
    if (window.ethereum) return connectMetaMask();
    toast({ title: 'No wallet detected', description: 'No HashPack or MetaMask was found on this page.' });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={autoDetectAndConnect}>{connected ? `Connected: ${account}` : 'Connect Wallet'}</Button>
    </div>
  );
};

export default WalletConnect;
