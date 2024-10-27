import axios, { AxiosError } from 'axios';

interface DeepSeekModel {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const MAX_RETRIES = 3;
const TIMEOUT = 5000;

export const fetchDeepSeekModels = async (): Promise<DeepSeekModel[]> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to fetch DeepSeek models.`);
      const response = await axios.get<DeepSeekModel[]>(`${API_URL}/models`, {
        timeout: TIMEOUT,
      });
      console.log('DeepSeek models fetched successfully.');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching DeepSeek models (attempt ${attempt}):`, error.message);
        if (attempt === MAX_RETRIES) {
          throw new Error('Failed to fetch DeepSeek models: ' + error.message);
        }
      } else {
        console.error('Unexpected error fetching DeepSeek models:', error);
        throw new Error('Failed to fetch DeepSeek models due to an unexpected error.');
      }
    }
  }
  throw new Error('Failed to fetch DeepSeek models after multiple attempts.');
};