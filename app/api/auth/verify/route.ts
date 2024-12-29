
import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // Here you would verify the signature against the challenge using the public key
    // For Solana, you'd use tweetnacl or similar library
    // Simplified for demo - you should implement proper signature verification
    
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
