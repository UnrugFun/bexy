import React from 'react';
import Image from 'next/image';
import TokenDeployerWrapper from '../components/TokenDeployerWrapper';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex justify-between items-center p-4">
        <Image
          src="https://i.imgur.com/k1x7uBw.jpeg"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-lg"
        />
      </header>
      <TokenDeployerWrapper />
    </main>
  );
}