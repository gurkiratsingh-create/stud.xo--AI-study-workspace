import axios from "axios"; // Import the axios library for making HTTP requests

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:8000";

interface AIChatResponse {
  response: string;
}

export async function generateAIResponse(
  message: string,
): Promise<string> {
  const response =
    await axios.post<AIChatResponse>(
      `${AI_SERVICE_URL}/chat`,
      {
        message,
      },
        {
          timeout: 120000,
        },
    );

  return response.data.response;
}