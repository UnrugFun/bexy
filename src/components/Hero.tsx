import React from 'react';
import Image from 'next/image';

const Hero: React.FC = () => (
  <div className="bg-background py-16">
    <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 mb-8 lg:mb-0">
        <h1 className="text-4xl lg:text-6xl font-bold text-accent mb-4">The next generation of AI-Launch platforms</h1>
        <p className="text-xl text-text mb-8">Taking memetic power x AI to the next level</p>
        <div className="flex items-center max-w-md">
          <input
            type="email"
            placeholder="Enter Email to join waitlist"
            className="bg-background text-text py-2 px-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent flex-grow border border-accent border-r-0"
          />
          <button className="btn rounded-l-none border border-accent">
            Join
          </button>
        </div>
      </div>
      <div className="lg:w-1/2 relative">
        <div style={{ width: '100%', height: '0', paddingBottom: '62.5%', position: 'relative' }}>
          <Image
            src="https://i.imgur.com/eKPlFYb.png"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
);

export default Hero;