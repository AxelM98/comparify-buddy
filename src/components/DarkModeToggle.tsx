
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Switch } from "./ui/switch";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Sun size={18} className="text-yellow-500 dark:text-gray-400" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon size={18} className="text-gray-400 dark:text-blue-300" />
    </div>
  );
};

export default DarkModeToggle;
