import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuth(true);
    }

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/auth" />;
};