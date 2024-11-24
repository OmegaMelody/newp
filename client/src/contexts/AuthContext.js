  import { useEffect, createContext, useState } from "react";
  import { useNavigate, useLocation } from 'react-router-dom';

  export const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            'http://localhost:7888/auth/user',
            { credentials: 'include' }
          );
          const responseData = await response.text();
          const userData = responseData ? JSON.parse(responseData) : null;
          setUser(userData);

          // Якщо користувач авторизований і є збережений шлях, перенаправити його
          const redirectPath = localStorage.getItem('redirectPath');
          if (userData && redirectPath) {
            localStorage.removeItem('redirectPath');
            navigate(redirectPath, { state: { activeTab: 'reviews', fromLogin: true } });
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }, [navigate]);

    return (
      <AuthContext.Provider value={{ user, setUser }}>
        {children}
      </AuthContext.Provider>
    )
  };
