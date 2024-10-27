interface OllamaModel {
  id: string;
  name: string;
  description: string;
}

/**
 * Generates an array of Ollama models from the downloaded content.
 * @param downloadedContent - A string containing model data in the format: "id,name,description" per line.
 * @returns An array of OllamaModel objects.
 */
export const generateOllamaModels = (downloadedContent: string): OllamaModel[] => {
  try {
    // Validate input
    if (typeof downloadedContent !== 'string' || downloadedContent.trim() === '') {
      throw new Error('Invalid downloaded content');
    }

    // Split the content into lines
    const lines = downloadedContent.split('\n').map(line => line.trim()).filter(line => line);

    // Initialize an array to hold the generated models
    const generatedModels: OllamaModel[] = [];

    // Process each line to generate models
    lines.forEach((line, index) => {
      // Assuming each line contains model data in the format: "id,name,description"
      const parts = line.split(',');
      
      // Validate the parsed data
      if (parts.length !== 3) {
        console.warn(`Skipping invalid line at index ${index}: ${line}`);
        return;
      }

      const [id, name, description] = parts;

      // Create a new Ollama model
      const model: OllamaModel = {
        id: id.trim(),
        name: name.trim(),
        description: description.trim(),
      };

      // Add the model to the array
      generatedModels.push(model);
    });

    // Log the generated models
    console.log('Generated Ollama models:', generatedModels);

    return generatedModels;
  } catch (error) {
    console.error('Error generating Ollama models:', error);
    return [];
  }
};

// Example usage
const downloadedContent = `
1,Model One,Description for model one
2,Model Two,Description for model two
3,Model Three,Description for model three
`;

const models = generateOllamaModels(downloadedContent);
console.log('Models:', models);
