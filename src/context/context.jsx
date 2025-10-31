import React, { createContext, useContext, useState, useEffect } from "react";


const AppContext = createContext();

export const ContextProvider = ({ children }) => {

    const [internalActiveSection, setInternalActiveSection] = useState("Dashboard");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // ADD THIS LINE
    
    // User state: store minimal user object and token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Initialize from localStorage
    useEffect(() => {
        try {
            const rawUser = localStorage.getItem('user');
            const rawToken = localStorage.getItem('token');
            if (rawUser) setUser(JSON.parse(rawUser));
            if (rawToken) setToken(rawToken);
        } catch (e) {
            console.warn('Failed to read auth from localStorage', e);
        }
    }, []);

    // helper to persist authentication state
    const setAuth = (userObj, jwt) => {
        setUser(userObj || null);
        setToken(jwt || null);
        try {
            if (userObj) localStorage.setItem('user', JSON.stringify(userObj));
            else localStorage.removeItem('user');

            if (jwt) localStorage.setItem('token', jwt);
            else localStorage.removeItem('token');
        } catch (e) {
            console.warn('Failed to persist auth to localStorage', e);
        }
    };

    const signOut = () => {
        setAuth(null, null);
    };

     return (
        <AppContext.Provider value={{
            internalActiveSection,
            setInternalActiveSection,
            isMobileSidebarOpen,        // ADD THIS LINE
            setIsMobileSidebarOpen,      // ADD THIS LINE
            user,
            token,
            setUser: (u) => setAuth(u, token),
            setToken: (t) => setAuth(user, t),
            setAuth,
            signOut
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};