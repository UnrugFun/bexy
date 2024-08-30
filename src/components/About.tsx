import React from 'react';

const About: React.FC = () => (
  <div className="bg-background py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold mb-6 text-accent text-center">Welcome to the Token Revolution!</h2>
      <div className="bg-background p-8 rounded-lg shadow-lg border border-accent">
        <p className="text-text text-lg mb-4">
          Yo, crypto fam! We&apos;re not just another token platform – we&apos;re the meme-powered, 
          AI-supercharged launchpad for your wildest token dreams! (Not-AI Generated text 😉)
        </p>
        <p className="text-text text-lg mb-4">
          Imagine creating tokens faster than you can say &quot;To the moon!&quot; 
          With our AI deployer, you&apos;ll be pumping out tokens like a pro, no PhD required!
        </p>
        <p className="text-text text-lg">
          Ready to join the token party? Strap in, HODL tight, and let&apos;s make some 
          blockchain magic happen! 
        </p>
      </div>
    </div>
  </div>
);

export default About;