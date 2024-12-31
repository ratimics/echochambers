
"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="flex h-screen">
            <div className="flex-1 bg-background p-4 flex items-center justify-center flex-col">
                <h1 className="text-xl font-bold text-red-500 mb-4">ratimics::legion</h1>
                <p className="text-sm text-muted-foreground mb-8">powered by gnon::echochambers<br/>welcome to hell</p>
                <button
                    onClick={() => router.push('/rooms')}
                    className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold text-lg"
                >
                    enter the abyss
                </button>
            </div>
        </div>
    );
}
