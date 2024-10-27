import axios, { AxiosError } from 'axios';

interface LMStudioModel {
  id: string;
  name: string;
  // Add other relevant fields
}

const API_URL = process.env.LMSTUDIO_API_URL || 'https://api.lmstudio.com';
const LMSTUDIO_API_KEY = process.env.LMSTUDIO_API_KEY;

const MAX_RETRIES = 3;
const TIMEOUT = 5000;

export const fetchLMStudioModels = async (): Promise<LMStudioModel[]> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to fetch LM Studio models.`);
      const response = await axios.get<LMStudioModel[]>(`${API_URL}/models`, {
        timeout: TIMEOUT,
      });
      console.log('LM Studio models fetched successfully.');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching LM Studio models (attempt ${attempt}):`, error.message);
        if (attempt === MAX_RETRIES) {
          throw new Error('Failed to fetch LM Studio models: ' + error.message);
        }
      } else {
        console.error('Unexpected error fetching LM Studio models:', error);
        throw new Error('Failed to fetch LM Studio models due to an unexpected error.');
      }
    }
  }
  throw new Error('Failed to fetch LM Studio models after multiple attempts.');
};