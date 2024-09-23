import React from 'react';

const LandingHero: React.FC = () => (
  <div className="bg-background py-16 flex flex-col items-center justify-center text-center min-h-screen">
    <h1 className="text-4xl lg:text-6xl font-bold text-accent mb-4">The next generation of AI-Launch platforms</h1>
    <p className="text-xl text-text mb-8">Taking memetic power x AI to the next level</p>
    <a href="https://forms.gle/qCXuJXyDCzmbdq4E6">
      <button className="btn bg-accent text-black py-2 px-6 rounded-md shadow-lg transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent animate-pulse">
        Join Waitlist
      </button>
    </a>
  </div>
);

export default LandingHero;