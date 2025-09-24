import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Get the form data
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        
        if (!file) {
            return NextResponse.json(
                { detail: 'No file provided' },
                { status: 400 }
            );
        }

        // Forward the request to the Groq backend
        const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/v1/transcribe`;
        
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('model', formData.get('model') as string || 'whisper-large-v3-turbo');
        formDataToSend.append('response_format', formData.get('response_format') as string || 'verbose_json');
        
        // Add timestamp granularities if provided
        const timestampGranularities = formData.getAll('timestamp_granularities[]');
        timestampGranularities.forEach(granularity => {
            formDataToSend.append('timestamp_granularities[]', granularity as string);
        });

        const response = await fetch(backendUrl, {
            method: 'POST',
            body: formDataToSend,
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return NextResponse.json(
                { detail: error.detail || 'Failed to transcribe audio' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { 
                detail: error instanceof Error ? error.message : 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? String(error) : undefined
            },
            { status: 500 }
        );
    }
}
