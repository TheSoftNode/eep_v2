import { Message } from "@/types/chat";

// API URL from the HTML example
const CHAT_API_URL = "https://guzi1yeed5.execute-api.eu-north-1.amazonaws.com/chatbot-1/chat";

export const sendMessage = async (message: string): Promise<string> => {
    const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
};

export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatAIResponse = (content: string): string => {
    // Add line breaks before headings if they don't exist
    content = content.replace(/([^\n])(#{1,6}\s)/g, '$1\n\n$2');
    // Add line breaks before lists if they don't exist
    content = content.replace(/([^\n])([-*]\s)/g, '$1\n\n$2');
    return content;
};

export const getSystemMessage = (): Message => {
    return {
        role: 'system',
        content: `You are a helpful AI assistant for the Enterprise Engagement Program (EEP). You help users understand the program, application process, and answer questions about AI and technology training.
        Format your responses using markdown with proper headings (##), lists (-), and emphasis (**bold**, *italic*) where appropriate.
        Keep responses well-structured and easy to read.
        Use headings for different sections, lists for multiple points, and emphasis for important information.
        Keep your responses focused on EEP, AI education, and enterprise technology training.`,
        id: 'system-message'
    };
};