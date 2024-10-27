import React, { useState, useEffect } from 'react';

interface Model {
  provider: string;
}

interface ModelFilterProps {
  models: Model[];
  onFilter: (filteredModels: Model[]) => void;
  defaultProvider?: string;
}

const ModelFilter: React.FC<ModelFilterProps> = ({ models, onFilter, defaultProvider = '' }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>(defaultProvider);

  useEffect(() => {
    handleFilterChange({ target: { value: defaultProvider } } as React.ChangeEvent<HTMLSelectElement>);
  }, [defaultProvider]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = event.target.value;
    setSelectedProvider(provider);
    const filteredModels = provider ? models.filter(model => model.provider === provider) : models;
    onFilter(filteredModels);
  };

  const uniqueProviders = Array.from(new Set(models.map(model => model.provider)));

  return (
    <div>
      <label htmlFor="model-filter">Filter by Provider:</label>
      <select id="model-filter" value={selectedProvider} onChange={handleFilterChange}>
        <option value="">All Providers</option>
        {uniqueProviders.map(provider => (
          <option key={provider} value={provider}>{provider}</option>
        ))}
      </select>
    </div>
  );
};

export default ModelFilter;