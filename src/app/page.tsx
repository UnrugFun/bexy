import React from 'react';
import Hero from '../components/Hero';
import TokenDeployerWrapper from '../components/TokenDeployerWrapper';
import About from '../components/About';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <TokenDeployerWrapper />
      <About />
    </main>
  );
}