import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 w-10 h-10 border border-gray-300 dark:border-anthropic-cream-subtle bg-white dark:bg-anthropic-slate-medium hover:bg-gray-100 dark:hover:bg-anthropic-slate-light transition-all duration-200"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-900" />
      ) : (
        <Sun className="h-5 w-5 text-anthropic-rust" />
      )}
    </Button>
  );
};

export default DarkModeToggle;