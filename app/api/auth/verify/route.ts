import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/server/store';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { decodeUTF8, decodeBase64 } from 'tweetnacl-util';

const challenges = new Map<string, string>();

export async function GET(request: Request) {
  const publicKey = request.headers.get('x-wallet-public-key');
  if (!publicKey) {
    return NextResponse.json({ error: 'Missing public key' }, { status: 400 });
  }

  const challenge = crypto.randomBytes(32).toString('hex');
  challenges.set(publicKey, challenge);

  return NextResponse.json({ challenge });
}

export async function POST(request: Request) {
  try {
    const { publicKey, signature, challenge } = await request.json();
    
    const storedChallenge = challenges.get(publicKey);
    if (!storedChallenge || storedChallenge !== challenge) {
      return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
    }

    try {
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      const signatureBytes = decodeBase64(signature);
      const messageBytes = decodeUTF8(challenge);
      
      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } catch (err) {
      console.error('Signature verification error:', err);
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
    }

    const db = await getDb();
    const walletExists = await db.query('SELECT 1 FROM wallets WHERE public_key = $1', [publicKey]);
    if (!walletExists.rows.length) {
      return NextResponse.json({ error: 'Unauthorized wallet' }, { status: 401 });
    }

    // Generate API key as hash of public key + timestamp
    const timestamp = Date.now().toString();
    const apiKey = crypto
      .createHash('sha256')
      .update(`${publicKey}:${timestamp}`)
      .digest('hex');

    challenges.delete(publicKey); // Clean up the challenge

    return NextResponse.json({ 
      apiKey,
      expiresAt: null 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify signature' }, { status: 400 });
  }
}