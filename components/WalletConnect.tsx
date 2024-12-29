
"use client";

import { useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from "@/hooks/use-toast";

export default function WalletConnect() {
  const [phantom, setPhantom] = useState<any>();
  const [publicKey, setPublicKey] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ("solana" in window) {
      setPhantom(window.solana);
    }
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

      // Get challenge
      const challengeResponse = await fetch('/api/auth/verify', {
        headers: {
          'x-wallet-public-key': publicKey
        }
      });
      const { challenge } = await challengeResponse.json();
      
      const encodedMessage = new TextEncoder().encode(challenge);
      const signedMessage = await phantom.signMessage(encodedMessage, "utf8");
      
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey,
          signature: bs58.encode(new Uint8Array(signedMessage)),
          challenge
        })
      });

      if (response.ok) {
        const { apiKey: newApiKey } = await response.json();
        localStorage.setItem('apiKey', newApiKey);
        setApiKey(newApiKey);
        setShowApiKey(true);
      } else {
        throw new Error('Failed to verify signature');
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify signature"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyApiKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      toast({
        title: "Success",
        description: "API key copied to clipboard"
      });
      setShowApiKey(false);
    }
  };

  const resetApiKey = () => {
    localStorage.removeItem('apiKey');
    setApiKey(null);
    setShowApiKey(false);
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
            {!apiKey && (
              <Button 
                onClick={signMessage} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Verifying..." : "Sign to Verify"}
              </Button>
            )}
            {apiKey && showApiKey && (
              <Button 
                onClick={copyApiKey}
                className="w-full"
                variant="outline"
              >
                Click to Copy API Key
              </Button>
            )}
            {apiKey && !showApiKey && (
              <Button 
                onClick={resetApiKey}
                className="w-full"
                variant="destructive"
              >
                Reset API Key
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
