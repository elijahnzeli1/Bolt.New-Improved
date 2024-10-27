import axios, { AxiosError } from 'axios';

interface Credentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string; // e.g., 'admin', 'user', etc.
  };
}

const API_URL = process.env.API_URL || 'http://localhost:3000';

export const authenticateUser = async (credentials: Credentials): Promise<AuthResponse> => {
  // Validate input data
  if (!credentials.username || !credentials.password) {
    throw new Error('Invalid input data: Username and password are required');
  }

  try {
    console.log('Attempting to authenticate user.');
    const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, credentials);
    console.log('User authenticated successfully.');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Authentication failed:', errorMessage);
      throw new Error(`Authentication failed: ${errorMessage}`);
    } else {
      console.error('Unexpected error during authentication:', error);
      throw new Error('Authentication failed due to an unexpected error.');
    }
  }
};