import React, { useContext, ReactNode } from "react";

import { NETWORK_VIEWER_DEFAULT_OPTIONS } from "../../constants";
import { NetworkViewerOptions } from "../../types";

export const ThemeContext = React.createContext<NetworkViewerOptions>(
  NETWORK_VIEWER_DEFAULT_OPTIONS
);

export const useTheme = (): NetworkViewerOptions => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContext");
  }

  return context;
};

interface ThemeProviderProps {
  options?: NetworkViewerOptions | null;
  children?: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  options = NETWORK_VIEWER_DEFAULT_OPTIONS,
  children,
  ...props
}) => {
  const finalOptions = {
    ...NETWORK_VIEWER_DEFAULT_OPTIONS,
    ...options,
  };

  return (
    <ThemeContext.Provider value={finalOptions} {...props}>
      {children}
    </ThemeContext.Provider>
  );
};
