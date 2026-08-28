import { Form } from "./components/Form";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import axios from "axios";
import { useEffect } from "react";
import { store } from "./store/states";
import { baseUrl } from "./utils/cors";

const App = () => {
  const { isLogin, user, logged_user, loggedOut_user }: any = store();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/profile`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      logged_user(response.data.data);
    } catch (error) {
      console.error(error);
      loggedOut_user();
    }
  };
  console.log({ user, isLogin });

  if (isLogin === null) {
    return <h1 className="text-2xl font-bold">Loading....</h1>;
  }

  return (
    <>
    <Routes>
  {isLogin ? (
    <>
      <Route path="/" element={<Form />} />
      <Route path="*" element={<Navigate to="/" />} />
    </>
  ) : (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </>
  )}
</Routes>
    </>
  );
};

export default App;
