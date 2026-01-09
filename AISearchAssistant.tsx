
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
      // Use the injected API key
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      
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

      const matchedIds = JSON.parse(response.text || '[]');
      onResult(matchedIds);
    } catch (err) {
      console.error('AI Search Error:', err);
      setError('AI search is currently unavailable.');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
        <h3 className="font-bold text-indigo-900">AI Personal Assistant</h3>
      </div>
      <form onSubmit={handleAISearch} className="flex gap-2">
        <input 
          type="text" 
          placeholder="e.g., 'Looking for a relaxing facial and maybe a hair touch up today'"
          className="flex-1 px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button disabled={isThinking} type="submit" className="shrink-0 bg-indigo-600 text-white px-6">
          {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search with AI'}
        </Button>
      </form>
      {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  );
};
