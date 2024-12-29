"use client";

import { useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Button } from './ui/button';

export default function WalletConnect() {
  const [phantom, setPhantom] = useState<any>();
  const [publicKey, setPublicKey] = useState<string>('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if ("solana" in window) {
      setPhantom(window.solana);
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
        const { apiKey } = await response.json(); // Changed to apiKey for consistency with the alert message.  Assumes the backend now returns an apiKey instead of sessionToken.
        localStorage.setItem('apiKey', apiKey);
        alert(`Your API key: ${apiKey}`);
      } else {
        throw new Error('Failed to verify signature');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate API key');
    }
  };

  if (!phantom) {
    return (
      <div className="p-4">
        <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
          <Button>Install Phantom Wallet</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {!connected ? (
        <Button onClick={connectWallet}>Connect Phantom Wallet</Button>
      ) : (
        <>
          <div>Connected: {publicKey.slice(0, 4)}...{publicKey.slice(-4)}</div>
          <Button onClick={signMessage}>Sign Message</Button>
        </>
      )}
    </div>
  );
}