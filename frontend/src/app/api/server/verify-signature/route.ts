import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.message || !body.signature) {
      return NextResponse.json(
        { error: 'Missing message or signature' },
        { status: 400 }
      );
    }

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/verify-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: body.message,
        signature: body.signature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Backend verification failed' },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Web3 Message Verifier API Proxy',
      endpoints: {
        verifySignature: 'POST /api/server/verify-signature'
      }
    }
  );
}