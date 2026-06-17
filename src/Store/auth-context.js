import React, { useState, useEffect, useCallback, useRef } from "react";

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  isLoading: false,
  login: (token) => {},
  logout: () => {},
});

const EXPIRATION_TIME = 5 * 60 * 1000; 

const calculateRemainingTime = (expirationTime) => {
  return expirationTime - Date.now();
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime = localStorage.getItem('expirationTime');

  if (!storedToken || !storedExpirationTime) {
    return null;
  }

  const remainingTime = calculateRemainingTime(+storedExpirationTime);

  if (remainingTime <= 0) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  const [token, setToken] = useState(tokenData ? tokenData.token : null);
  const [isLoading, setIsLoading] = useState(true);
  const logoutTimerRef = useRef();

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  }, []);

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);

    const expirationTime = Date.now() + EXPIRATION_TIME;
    localStorage.setItem('expirationTime', expirationTime.toString());

    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimerRef.current = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimerRef.current = setTimeout(logoutHandler, tokenData.duration);
    }
    setIsLoading(false);
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: !!token,
    isLoading: isLoading,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;