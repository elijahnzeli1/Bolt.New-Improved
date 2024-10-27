import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Define types for project files and options
interface ProjectFile {
  name: string;
  content: Blob | string;
  directory?: string;
}

interface ZipOptions {
  fileName?: string;
  compression?: number;  // 1 (best speed) to 9 (best compression)
  onProgress?: (percent: number) => void;
  metadata?: {
    createdAt?: Date;
    author?: string;
    description?: string;
  };
  password?: string; // Optional password for encryption
}

interface ProcessedFile extends ProjectFile {
  path: string;
}

interface ExtendedJSZipGeneratorOptions extends JSZip.JSZipGeneratorOptions<"blob"> {
  onUpdate?: (progress: { percent: number }) => void;
}

/**
 * Downloads project files as a zip archive
 * @param projectFiles - Array of files to be included in the zip
 * @param options - Configuration options for the zip file
 * @returns Promise that resolves when the download is complete
 */
export const downloadProjectAsZip = async (
  projectFiles: ProjectFile[],
  options: ZipOptions = {}
): Promise<void> => {
  try {
    // Validate input
    if (!Array.isArray(projectFiles) || projectFiles.length === 0) {
      throw new Error('Project files array is empty or invalid');
    }

    // Process and validate each file
    const processedFiles: ProcessedFile[] = projectFiles.map(file => {
      if (!file.name || (!file.content && file.content !== '')) {
        throw new Error(`Invalid file structure: ${JSON.stringify(file)}`);
      }

      // Construct full file path including directory if provided
      const path = file.directory 
        ? `${file.directory.replace(/^\/+|\/+$/g, '')}/${file.name}`
        : file.name;

      return { ...file, path };
    });

    // Set default options
    const {
      fileName = 'project.zip',
      compression = 5,
      onProgress,
      metadata = {},
      password
    } = options;

    // Create new zip instance
    const zip = new JSZip();

    // Add metadata if provided
    if (Object.keys(metadata).length > 0) {
      zip.file('metadata.json', JSON.stringify({
        ...metadata,
        createdAt: metadata.createdAt || new Date(),
        fileCount: processedFiles.length,
      }, null, 2));
    }

    // Add files to zip
    processedFiles.forEach(file => {
      zip.file(file.path, file.content);
    });

    // Generate zip file with progress tracking
    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: compression
      },
      comment: `Created on ${new Date().toISOString()}`,
      onUpdate: (progress: { percent: number }) => {
        if (typeof progress.percent === 'number') {
          onProgress?.(progress.percent);
        }
      },
      password: password || undefined, // Add password if provided
    } as ExtendedJSZipGeneratorOptions).catch((error) => {
      console.error('Error generating zip file:', error);
      throw new Error('Failed to generate zip file');
    });

    // Validate zip file size (browser limitations)
    const MAX_ZIP_SIZE = 2 * 1024 * 1024 * 1024; // 2GB limit
    if (content.size > MAX_ZIP_SIZE) {
      throw new Error('Zip file size exceeds 2GB limit');
    }

    // Trigger download
    saveAs(content, fileName);

  } catch (error) {
    // Log error for debugging
    console.error('Error creating zip file:', error);

    // Re-throw with user-friendly message
    throw new Error(
      error instanceof Error 
        ? `Failed to create zip file: ${error.message}`
        : 'Failed to create zip file'
    );
  }
};

/**
 * Example usage with all features
 */
export const exampleUsage = async () => {
  const files: ProjectFile[] = [
    {
      name: 'readme.md',
      content: new Blob(['# Project Documentation'], { type: 'text/markdown' }),
      directory: 'docs'
    },
    {
      name: 'config.json',
      content: JSON.stringify({ version: '1.0.0' }),
      directory: 'config'
    }
  ];

  try {
    await downloadProjectAsZip(files, {
      fileName: 'my-project.zip',
      compression: 9,
      onProgress: (percent) => {
        console.log(`Zip progress: ${percent}%`);
      },
      metadata: {
        author: 'John Doe',
        description: 'Project backup',
        createdAt: new Date()
      },
      password: 'securepassword123' // Optional password for encryption
    });
  } catch (error) {
    console.error('Failed to download project:', error);
  }
};