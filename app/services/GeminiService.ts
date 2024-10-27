import axios, { AxiosError } from 'axios';

const API_URL = process.env.GEMINI_API_URL || 'https://api.gemini.com';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MAX_RETRIES = 3;
const TIMEOUT = 5000;

interface FetchGeminiDataParams {
  [key: string]: any; // Define a more specific type if possible
}

interface GeminiData {
  // Define the structure of the response data
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchGeminiData = async (params: FetchGeminiDataParams): Promise<GeminiData[]> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt} to fetch Gemini data with params:`, params);
      const response = await axios.get<GeminiData[]>(`${API_URL}/data`, {
        params,
        timeout: TIMEOUT,
      });
      console.log('Gemini data fetched successfully.');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`Error fetching Gemini data (attempt ${attempt}):`, error.message);
        if (attempt === MAX_RETRIES) {
          throw new Error('Failed to fetch Gemini data: ' + error.message);
        }
      } else {
        console.error('Unexpected error fetching Gemini data:', error);
        throw new Error('An unexpected error occurred while fetching Gemini data.');
      }
    }
  }
  throw new Error('Failed to fetch Gemini data after multiple attempts.');
};