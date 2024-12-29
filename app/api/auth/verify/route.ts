
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { decodeUTF8 } from 'tweetnacl-util';
import bs58 from 'bs58';

const challenges = new Map<string, string>();
const ALLOWED_WALLETS = [
  // Add your allowed wallet public keys here
  '*' // Allow all wallets for testing
];

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
    
    if (!ALLOWED_WALLETS.includes(publicKey)) {
      return NextResponse.json({ error: 'Unauthorized wallet' }, { status: 401 });
    }

    const storedChallenge = challenges.get(publicKey);
    if (!storedChallenge || storedChallenge !== challenge) {
      return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
    }

    // Verify signature
    try {
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      const signatureBytes = Buffer.from(signature, 'base64');
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
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
    }

    const timestamp = Date.now().toString();
    const apiKey = crypto
      .createHash('sha256')
      .update(`${publicKey}:${timestamp}`)
      .digest('hex');

    challenges.delete(publicKey);

    return NextResponse.json({ 
      apiKey,
      expiresAt: null 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify signature' }, { status: 400 });
  }
}
