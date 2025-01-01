
'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { DialogTitle } from '@/components/ui/dialog';

function HomeContent() {
  const router = useRouter();

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-background/80">
        <VisuallyHidden>
          <DialogTitle>Home Page</DialogTitle>
        </VisuallyHidden>
      <div className="flex-1 flex items-center justify-center flex-col p-4">
        <h1 className="text-3xl font-bold text-red-500 mb-4 tracking-tight">ratimics::legion</h1>
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">powered by</p>
          <p className="text-xs text-muted-foreground">gnon::echochambers</p>
        </div>
        <button
          onClick={() => router.push('/rooms/home')}
          className="px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg mb-8"
        >
          enter the abyss
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
