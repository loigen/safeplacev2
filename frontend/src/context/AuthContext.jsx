import { createContext, useCallback, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async () => {
    setIsRegisterLoading(true);
    setRegisterError(null);
    const response = await postRequest(
      `${baseUrl}/auth/signup`,
      JSON.stringify(registerInfo)
    );
    setIsRegisterLoading(false);
    if (response.error) {
      setRegisterError(response);
    }
    localStorage.setItem("User", JSON.stringify(response));
    setUser(response);
  }, [registerInfo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // Ensure setUser is provided
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
