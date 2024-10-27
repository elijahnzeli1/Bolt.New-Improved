import React from 'react';

interface LocalProjectLoaderProps {
  onLoad: (file: File) => void;
}

const LocalProjectLoader: React.FC<LocalProjectLoaderProps> = ({ onLoad }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Optional chaining to handle cases where no file is selected
    if (file) {
      if (file.type !== 'application/zip') {
        alert('Please upload a ZIP file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        if (typeof fileContent === 'string') {
          // Process the file content as needed
          console.log('File content loaded:', fileContent);
          // You can add additional logic here to handle the loaded content
          onLoad(file);
        }
      };
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
        alert('Failed to read file. Please try again.');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <label htmlFor="file-input">Load Local Project:</label>
      <input
        id="file-input"
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        style={{ display: 'block', marginTop: '10px' }}
      />
    </div>
  );
};

export default LocalProjectLoader;