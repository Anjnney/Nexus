
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getTransitUpdate = async (query: string): Promise<{ text: string, sources: any[] }> => {
  const ai = getAIClient();
  const prompt = `Act as a Mumbai Transit Expert. Answer the following about Mumbai Local Trains or commutes to Vidyavihar Station: "${query}". Provide live-status-based advice using search results. Include specific train times if available.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "Could not fetch live updates.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateStudyPlan = async (subjects: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `I am a student at KJSSE (KJ Somaiya College of Engineering). Based on these subjects: "${subjects}", create a high-intensity 14-day study plan for the End Semester Exams. Include key topics to prioritize based on the Mumbai University / Somaiya autonomous syllabus patterns.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });

  return response.text || "Failed to generate study plan.";
};

export const getCampusLocation = async (locationName: string, userLat?: number, userLng?: number): Promise<{ text: string, sources: any[] }> => {
  const ai = getAIClient();
  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  if (userLat && userLng) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: { latitude: userLat, longitude: userLng }
      }
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find the location and directions for "${locationName}" within or near KJ Somaiya College of Engineering, Vidyavihar. Help the student find the building or lab.`,
    config
  });

  return {
    text: response.text || "Location not found.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const conductMockInterview = async (company: string, role: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Conduct a technical mock interview for a KJSSE student applying to ${company} for the role of ${role}. Start by asking 3 challenging technical questions based on typical recruitment patterns for this company at our campus. Mention specific skills like Java/React/Cloud if they are relevant to this company's typical hiring profile in Mumbai.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });

  return response.text || "Interview module failed to load.";
};

export const getCompanyProfile = async (companyName: string): Promise<{ text: string, sources: any[] }> => {
  const ai = getAIClient();
  const prompt = `Provide a detailed recruiter profile for "${companyName}" specifically focused on their hiring patterns for campus placements in India (like KJSSE). 
  Include:
  1. Typical Roles (e.g., SDE, Analyst, Consultant).
  2. Core Skills required for freshers.
  3. Interview Round structure (Aptitude, Technical, HR).
  4. Employee reviews/culture for freshers.
  Use live search to find recent placement reports or glassdoor insights.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "Could not fetch company insights.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateProjectIdeas = async (input: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `As a technical hackathon mentor, suggest 3 innovative project ideas based on the student's interest in "${input}". For each idea, include a catchy title and a brief technical implementation roadmap.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });

  return response.text || "Failed to generate project ideas.";
};

export const refineProjectCanvas = async (project: { title: string, description: string, techStack: string }): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Review this hackathon project proposal and provide expert feedback to make it more competitive:
  Title: ${project.title}
  Description: ${project.description}
  Tech Stack: ${project.techStack}
  
  Focus on technical feasibility, innovation, and potential impact.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });

  return response.text || "Failed to refine the project proposal.";
};

export const generateSprintPlan = async (project: { title: string, description: string, techStack: string }): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Create a high-speed 48-hour development roadmap (Sprint Plan) for the project "${project.title}".
  Goal: Build an MVP using ${project.techStack}.
  Context: ${project.description}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });

  return response.text || "Failed to generate sprint roadmap.";
};

export const generateAppLogo = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Create a professional, minimalist app logo for an application described as: "${prompt}". The design should be modern and clean, suitable for a mobile app icon.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64Data = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${base64Data}`;
    }
  }

  throw new Error("No image was returned by the model.");
};

export const techScoutSearch = async (query: string): Promise<{ text: string, sources: any[] }> => {
  const ai = getAIClient();
  const prompt = `Find technical guides, documentation, and best practices for: "${query}". Focus on official developer resources.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "No results found for your technical query.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
