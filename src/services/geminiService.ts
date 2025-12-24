
import { GoogleGenAI, Type } from "@google/genai";
import { StudyModule, Flashcard, QuizQuestion, JSSPTask } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function generateStandardSyllabus(courseName: string) {
  const prompt = `Provide a comprehensive academic syllabus for a course titled "${courseName}". 
  Include exactly 8 core topics/keywords separated by commas.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });
  return response.text || "";
}

export async function generateLearningRoadmap(subject: string, syllabus: string, duration: string) {
  const prompt = `Act as an Expert Academic Architect. 
  Subject: "${subject}". 
  Syllabus: "${syllabus}".
  Target: "${duration}".
  
  Use a JSSP-inspired approach to distribute these modules for optimal makespan. 
  Create exactly 6-8 modules. For each, provide:
  1. Title
  2. Description
  3. Difficulty (Beginner/Intermediate/Advanced)
  4. Estimated hours
  5. YouTube Search Query (string)
  
  Return ONLY a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              estimatedDuration: { type: Type.STRING },
              resources: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "difficulty", "estimatedDuration", "resources"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Roadmap error:", error);
    return [];
  }
}

export async function getModuleExplanation(subject: string, moduleTitle: string) {
  const prompt = `Act as a specialized tutor agent for "${subject}". 
  Provide a deep-dive explanation for the module: "${moduleTitle}". 
  Use academic Markdown, examples, and highlight core concepts.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text || "";
}

export async function getDoubtSolverResponse(context: string, question: string) {
  const prompt = `Context: ${context}. Student Doubt: "${question}". 
  Provide a concise, technically accurate solution. 
  Address the student as their specific Course Agent.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text || "";
}

export async function getChatbotResponse(history: { role: string; text: string }[], message: string) {
  const historyText = history.map(h => `${h.role === 'user' ? 'Student' : 'Assistant'}: ${h.text}`).join('\n');
  const fullPrompt = historyText ? `${historyText}\nStudent: ${message}` : message;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: fullPrompt,
    config: {
      systemInstruction: "You are a helpful academic assistant named Smart Learn AI. Provide concise and accurate answers to student queries regarding their studies and general learning doubts.",
    }
  });
  return response.text || "";
}

export async function generateFlashcards(subject: string, moduleTitle: string): Promise<Flashcard[]> {
  const prompt = `Generate 5 flashcards for "${moduleTitle}" in "${subject}". JSON: question, answer.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } },
          required: ["question", "answer"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}

export async function generateQuiz(subject: string, moduleTitle: string): Promise<QuizQuestion[]> {
  const prompt = `Generate 5 high-quality MCQs for "${moduleTitle}". JSON: question, options(4), correctAnswer(0-3).`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER }
          },
          required: ["question", "options", "correctAnswer"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}

export async function optimizeJSSPSchedule(tasks: JSSPTask[]) {
  const prompt = `Act as an Industrial Optimization Agent using the "Time-Indexed Instance Representation" for JSSP. 
  Optimize the makespan for the following learning tasks: ${JSON.stringify(tasks)}.
  Minimize the idle time between modules and balance the cognitive load across study slots.
  Return an array of objects containing ONLY 'operation' (matching input title) and 'startTime' (integer hour offset).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            operation: { type: Type.STRING },
            startTime: { type: Type.INTEGER }
          },
          required: ["operation", "startTime"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
}

// Added to fix missing export error in components/MultiAgentHub.tsx
// This function simulates a dialogue between academic agents to provide collaborative reasoning.
export async function simulateAgentCollaboration(context: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Based on the following context, simulate a collaboration dialogue between a Syllabus Analyst, a Priority Architect, and a Stress Monitor agent to provide a unified learning strategy: ${context}`,
    config: {
      systemInstruction: "You are an AI Multi-Agent Orchestrator. Coordinate three agents: a Syllabus Analyst, a Priority Architect, and a Stress Monitor. They should discuss and recommend an optimal path for the student's success.",
    }
  });
  return response.text || "Collaboration could not be completed.";
}

export function calculateSchedule(roadmap: StudyModule[], studyHoursPerDay: number) {
  let currentDay = 1;
  let currentDayHours = 0;
  
  return roadmap.map(module => {
    const hours = parseInt(module.estimatedDuration) || 2;
    if (currentDayHours + hours > studyHoursPerDay) {
      currentDay++;
      currentDayHours = hours;
    } else {
      currentDayHours += hours;
    }
    return {
      title: module.title,
      day: currentDay,
      hoursAllocated: hours
    };
  });
}
