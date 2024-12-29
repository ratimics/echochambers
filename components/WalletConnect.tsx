
"use client";

import { useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export default function WalletConnect() {
  const [phantom, setPhantom] = useState<any>();
  const [publicKey, setPublicKey] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("solana" in window) {
      setPhantom(window.solana);
    }
    // Check for existing API key
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana) {
        const response = await solana.connect();
        setPublicKey(response.publicKey.toString());
        setConnected(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const signMessage = async () => {
    try {
      setIsLoading(true);
      if (!phantom) return;
      const message = `Verify wallet ownership\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await phantom.signMessage(encodedMessage, "utf8");
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey,
          signature: signedMessage.toString(),
          message
        })
      });

      if (response.ok) {
        const { apiKey: newApiKey } = await response.json();
        localStorage.setItem('apiKey', newApiKey);
        setApiKey(newApiKey);
      } else {
        throw new Error('Failed to verify signature');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!phantom) {
    return (
      <Card className="p-4 max-w-md mx-auto">
        <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
          <Button className="w-full">Install Phantom Wallet</Button>
        </a>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex flex-col gap-2">
        {!connected ? (
          <Button onClick={connectWallet} className="w-full">Connect Phantom Wallet</Button>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span>Wallet: {publicKey.slice(0, 4)}...{publicKey.slice(-4)}</span>
              <Badge variant={apiKey ? "success" : "secondary"}>
                {apiKey ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <Button 
              onClick={signMessage} 
              disabled={isLoading || !!apiKey}
              className="w-full"
            >
              {isLoading ? "Verifying..." : apiKey ? "Already Verified" : "Sign to Verify"}
            </Button>
            {apiKey && (
              <div className="text-sm text-muted-foreground mt-2">
                API Key: {apiKey.slice(0, 8)}...{apiKey.slice(-8)}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
