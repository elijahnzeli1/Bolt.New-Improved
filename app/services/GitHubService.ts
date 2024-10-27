import axios, { AxiosError } from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

interface RepoData {
  owner: string;
  repo: string;
  path: string;
  message: string;
  content: string;
}

interface GitHubResponse {
  content: {
    name: string;
    path: string;
    sha: string;
    // Add other relevant fields
  };
  // Add other relevant fields
}

export const publishToGitHub = async (repoData: RepoData, token: string): Promise<GitHubResponse> => {
  // Validate input data
  if (!repoData.owner || !repoData.repo || !repoData.path || !repoData.message || !repoData.content) {
    throw new Error('Invalid input data');
  }

  try {
    console.log(`Publishing to GitHub repository: ${repoData.owner}/${repoData.repo}, path: ${repoData.path}`);
    const response = await axios.post<GitHubResponse>(
      `${GITHUB_API_URL}/repos/${repoData.owner}/${repoData.repo}/contents/${repoData.path}`,
      {
        message: repoData.message,
        content: repoData.content,
      },
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    console.log('Successfully published to GitHub.');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error publishing to GitHub:', error.message);
      throw new Error(`Failed to publish to GitHub: ${error.message}`);
    } else {
      console.error('Unexpected error publishing to GitHub:', error);
      throw new Error('Failed to publish to GitHub due to an unexpected error.');
    }
  }
};