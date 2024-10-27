export const versionControl = (modelId: string, versionData: any) => {
  const modelVersions: Record<string, any[]> = {}; // Store versions for each model

  const saveVersion = (modelId: string, version: any): void => {
    if (!modelVersions[modelId]) {
      modelVersions[modelId] = []; // Initialize array if it doesn't exist
    }
    modelVersions[modelId].push(version); // Save the new version
  };

  const getVersions = (modelId: string): any[] => {
    return modelVersions[modelId] || []; // Return versions or an empty array if none exist
  };

  const deleteVersion = (modelId: string, versionIndex: number): void => {
    if (modelVersions[modelId]) {
      if (modelVersions[modelId] && versionIndex >= 0 && versionIndex < modelVersions[modelId].length) {
        modelVersions[modelId].splice(versionIndex, 1); // Remove the specified version
      } else {
        console.warn(`Version index ${versionIndex} is out of bounds for modelId ${modelId}.`); // Log a warning if the index is invalid
      }
    } // Close the deleteVersion function
}
}; // Close the versionControl function
