import React, { useState } from 'react';

interface ImagePromptUploaderProps {
  onImageUpload: (image: File | null) => void;
}

const ImagePromptUploader: React.FC<ImagePromptUploaderProps> = ({ onImageUpload }) => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Unsupported file type. Please upload an image.');
        setImage(null);
        setPreviewUrl(null);
        onImageUpload(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size exceeds the limit of 5MB.');
        setImage(null);
        setPreviewUrl(null);
        onImageUpload(null);
        return;
      }

      setImage(file);
      onImageUpload(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setImage(null);
      setPreviewUrl(null);
      setError('Failed to upload image. Please try again.');
      onImageUpload(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <label htmlFor="image-upload" style={{ display: 'block', marginBottom: '10px' }}>Upload Image:</label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {previewUrl && <img src={previewUrl} alt="Image preview" style={{ maxWidth: '100%', marginTop: '10px' }} />}
    </div>
  );
};

export default ImagePromptUploader;