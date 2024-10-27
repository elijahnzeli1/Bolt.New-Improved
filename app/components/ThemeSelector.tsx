import React from 'react';

interface ThemeSelectorProps {
  onThemeChange: (theme: string) => void;
  defaultTheme?: string;
  themes?: string[];
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange, defaultTheme = 'light', themes = ['light', 'dark'] }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onThemeChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="theme-selector">Select Theme:</label>
      <select id="theme-selector" onChange={handleChange} defaultValue={defaultTheme}>
        {themes.map(theme => (
          <option key={theme} value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;