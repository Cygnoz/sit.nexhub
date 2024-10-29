import React, { createContext, useContext, useState, useEffect } from 'react';
type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize the state based on local storage
    const token = localStorage.getItem('authToken');
    return token !== null; // Return true if a token exists
  });
  useEffect(() => {
    // You can add additional checks here if needed
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(token !== null);
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};