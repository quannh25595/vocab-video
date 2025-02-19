"use client";

import React, { createContext, useContext, useState } from "react";

interface ConfigContextType {
  config: {
    wordRepeat: number;
    delayBetweenWords: number;
  };
  setConfig: (config: {
    wordRepeat: number;
    delayBetweenWords: number;
  }) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState({
    wordRepeat: 2,
    delayBetweenWords: 1000,
  });

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
