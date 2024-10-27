import axios, { AxiosError } from 'axios';

interface FetchRoutesParams {
  // Define the parameters expected by the API
  [key: string]: any;
}

interface Route {
  // Define the structure of a route object
  id: string;
  name: string;
  // Add other relevant fields
}

const API_URL = 'https://api.example.com';

export const fetchRoutes = async (params: FetchRoutesParams): Promise<Route[]> => {
  try {
    console.log('Fetching routes with provided parameters.');
    const response = await axios.get<Route[]>(`${API_URL}/routes`, { params });
    console.log('Routes fetched successfully.');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching routes:', error.message);
      throw new Error('Failed to fetch routes: ' + error.message);
    } else {
      console.error('Unexpected error fetching routes:', error);
      throw new Error('Failed to fetch routes due to an unexpected error.');
    }
  }
};