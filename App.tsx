
import React, { useState, useCallback, useEffect } from 'react';
import type { VideoConfig, VideoResult } from './types';
import { generateVideo } from './services/geminiService';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ResultsPanel } from './components/ResultsPanel';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [config, setConfig] = useState<VideoConfig>({
    model: 'veo-2.0-generate-001',
    aspectRatio: '16:9',
    enableSound: false,
    resolution: '1080p',
    numberOfVideos: 1,
    allowAllAge: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [videoHistory, setVideoHistory] = useState<VideoResult[]>([]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      setError('API Key is required.');
      return;
    }
    if (!prompt) {
      setError('Prompt cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const videoUrls = await generateVideo(
        apiKey,
        prompt,
        config,
        imageFile,
        setLoadingMessage
      );

      const newResults: VideoResult[] = videoUrls.map(url => ({
        id: uuidv4(),
        videoUrl: url,
        prompt: prompt,
        imageName: imageFile?.name,
        config: { ...config },
      }));

      setVideoHistory(prev => [...newResults, ...prev]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [apiKey, prompt, config, imageFile]);

  const handleClearHistory = () => {
    setVideoHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gray-800/50 rounded-lg p-6 shadow-2xl h-fit sticky top-8">
          <PromptForm
            apiKey={apiKey}
            setApiKey={setApiKey}
            prompt={prompt}
            setPrompt={setPrompt}
            imageFile={imageFile}
            setImageFile={setImageFile}
            config={config}
            setConfig={setConfig}
            isLoading={isLoading}
            onGenerate={handleGenerate}
          />
        </div>
        <div className="lg:col-span-2">
          <ResultsPanel
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            error={error}
            videoHistory={videoHistory}
            onClearHistory={handleClearHistory}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
