import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
  import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  } catch {
    setIsAuth(false);
  }

  setLoading(false);
}, []);

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/auth" />;
};

export default ProtectedRoute;