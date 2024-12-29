
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${params.roomId}/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error regenerating room description:', error);
    return NextResponse.json({ error: 'Failed to regenerate description' }, { status: 500 });
  }
}
