
import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Button } from './UIComponents.tsx';
import { MOCK_BUSINESSES } from './constants.tsx';

export const AISearchAssistant: React.FC<{ onResult: (matchedIds: string[] | null) => void }> = ({ onResult }) => {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsThinking(true);
    setError(null);
    try {
      // Create a new GoogleGenAI instance right before making an API call.
      // Always use process.env.API_KEY directly from the environment.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I have the following businesses: ${JSON.stringify(MOCK_BUSINESSES.map(b => ({ id: b.id, name: b.name, cat: b.category, desc: b.description })))}. 
        The user is asking for: "${query}". 
        Analyze their needs and return a JSON array of business IDs that would be relevant. If none match, return an empty array.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      // Directly access the .text property (not a method).
      const textOutput = response.text || '[]';
      const matchedIds = JSON.parse(textOutput.trim());
      onResult(matchedIds);
    } catch (err) {
      console.error('AI Search Error:', err);
      setError('Assistant unavailable. Try again in a moment.');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="bg-white border border-red-100 rounded-2xl p-6 mb-8 shadow-sm ring-4 ring-red-50/50">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-red-600" />
        <h3 className="font-bold text-gray-900">Search with AI Assistant</h3>
      </div>
      <form onSubmit={handleAISearch} className="flex gap-2">
        <input 
          type="text" 
          placeholder="e.g., 'I need a haircut this afternoon in NYC'"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button disabled={isThinking} type="submit" className="shrink-0 bg-red-600 hover:bg-red-700 text-white px-6 font-bold rounded-xl shadow-md shadow-red-100">
          {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </Button>
      </form>
      {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  );
};
