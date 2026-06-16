import React, { useState,useEffect,useCallback } from "react";
const AuthContext=React.createContext({
token:'',
isLoggedIn: false,
isLoggedIn:true,
login:(token)=>{},
    logout:()=>{}
})
const API_KEY='AIzaSyCmgfZ_CuWMgu_eR9F4ZRJnnXpMIXaGOVw';
   export  const AuthContextProvider=(props)=>{
    const initialToken= localStorage.getItem('token');
        const [token,setToken]=useState(initialToken);
        const[isLoading,setIsLoading]=useState(true);
        const UserIsLoggedIn = !!token

        const loginHandler=(token)=>{
            setToken(token)
            localStorage.setItem('token',token)
        }
        const logoutHandler=useCallback(()=>{
            setToken(null)
            localStorage.removeItem('token')
        },[]);
        useEffect(()=>{
            if(!initialToken){
                setIsLoading(false);
                return
            }
            const validateTokenOnRefresh = async () => {
      try {
        const response = await fetch(
          `https://googleapis.com='AIzaSyCmgfZ_CuWMgu_eR9F4ZRJnnXpMIXaGOVw'`,
          {
            method: 'POST',
            body: JSON.stringify({ idToken: initialToken }),
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!response.ok) {
          throw new Error('Token expired or invalid');
        }
        
        setToken(initialToken);
      } catch (error) {
        logoutHandler(); 
      } finally {
        setIsLoading(false);
      }
    };

    validateTokenOnRefresh();
  }, [initialToken, logoutHandler]);

        
        const contextValue={
            token:token,
            isLoggedIn:UserIsLoggedIn,
            login:loginHandler,
            logout:logoutHandler

        }
        return<AuthContextProvider value={contextValue}>
            {props.children}
            </AuthContextProvider>
    }

export default AuthContext;