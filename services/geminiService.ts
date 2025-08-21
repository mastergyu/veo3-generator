// services/geminiService.ts
// Dummy biar build Vercel nggak error

export async function generateText(prompt: string): Promise<string> {
  return `Dummy response untuk prompt: ${prompt}`;
}

export async function generateVideo(prompt: string, aspect: string = "16:9") {
  return {
    message: `Dummy video generated dengan prompt "${prompt}" dan aspect ratio ${aspect}`
  };
}
