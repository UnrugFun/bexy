import React from 'react';
import { FormData } from './types';

interface TokenFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onDeploy: () => void;
}

const TokenForm: React.FC<TokenFormProps> = ({ formData, setFormData, onDeploy }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name && formData.symbol) {
      onDeploy();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-accent text-sm font-medium mb-2">Token Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full bg-background text-text border border-accent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>
      <div>
        <label htmlFor="symbol" className="block text-accent text-sm font-medium mb-2">Token Symbol</label>
        <input
          type="text"
          id="symbol"
          value={formData.symbol}
          onChange={handleInputChange}
          className="w-full bg-background text-text border border-accent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-accent text-sm font-medium mb-2">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full bg-background text-text border border-accent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent"
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="website" className="block text-accent text-sm font-medium mb-2">Website</label>
        <input
          id="website"
          value={formData.website}
          onChange={handleInputChange}
          className="w-full bg-background text-text border border-accent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div>
        <label htmlFor="logo" className="block text-accent text-sm font-medium mb-2">Logo URL</label>
        <input
          id="logo"
          value={formData.logo}
          onChange={handleInputChange}
          className="w-full bg-background text-text border border-accent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-accent text-background py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200"
      >
        Deploy Token
      </button>
    </form>
  );
};

export default TokenForm;