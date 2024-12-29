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
  
  // Check if the request needs API key validation
  const needsAuth = PROTECTED_PATHS.some(p => {
    const pathPattern = p.replace('[roomId]', '[^/]+');
    const regex = new RegExp(`^${pathPattern}`);
    return regex.test(path);
  });

  if (needsAuth && (request.method === 'POST' || path.includes('/message'))) {
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
  return validKeys.includes(apiKey)
}

export const config = {
  matcher: '/api/:path*',
} 