import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require API key authentication
const PROTECTED_PATHS = [
  '/api/rooms/[roomId]/message',
  '/api/rooms'  // Only POST requests need auth
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const apiKey = request.headers.get('x-api-key')
  
  console.log('Middleware:', request.method, path, apiKey ? 'Has API key' : 'No API key');
  
  // Only require auth for POST/PUT/DELETE requests
  const needsAuth = PROTECTED_PATHS.some(p => {
    const pathPattern = p.replace('[roomId]', '[^/]+');
    const regex = new RegExp(`^${pathPattern}`);
    return regex.test(path);
  }) && ['POST', 'PUT', 'DELETE'].includes(request.method);

  if (needsAuth) {
    if (!apiKey || !isValidApiKey(apiKey)) {
      console.log('Middleware: Request rejected - invalid or missing API key');
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

// Simple API key validation - you might want to make this more sophisticated
function isValidApiKey(apiKey: string): boolean {
  const validKeys = process.env.VALID_API_KEYS?.split(',') || []
  // Also check if it's a valid session token format (publicKey:randomString)
  const isSessionToken = apiKey.includes(':') && apiKey.split(':').length === 2
  return validKeys.includes(apiKey) || isSessionToken
}

export const config = {
  matcher: '/api/:path*',
} 