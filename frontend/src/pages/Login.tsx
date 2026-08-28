import { useState, type FormEvent } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/cors";

const Login = () => {
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!email) {
        alert("Email is required");
        return;
      }

      if (!password) {
        alert("Password is required");
        return;
      }

      const response = await axios.post(`${baseUrl}/api/v1/login`, {
        email: email,
        password: password,
      });
      alert("login successful");
      localStorage.setItem("token", response.data.data)
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center md:min-h-screen">
        <div className="rounded-lg px-15 py-34 ">
          <form onSubmit={handleLogin} className="flex flex-col gap-7">
            <h1 className="p-5 text-3xl md:text-4xl font-bold text-center tracking-widest">
              Login
            </h1>
            <input
              type="text"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => set_email(e.target.value)}
              className="border border-blue-400 max-w-md rounded-lg outline-none p-2 hover:border-rose-600 focus:border-green-700 transition-colors duration-400 md: min-w-md text-center text-base"
            />
            <input
              type="text"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => set_password(e.target.value)}
              className="border border-blue-400 max-w-md rounded-lg outline-none p-2 hover:border-rose-600 focus:border-green-700 transition-colors duration-400 md: min-w-md text-center text-base"
            />
            <div>
              <p className="text-center">
                Don't have an account? <Link to="/signup">Signup</Link> now
              </p>
            </div>
            <div className="flex justify-center ">
              <button
                type="submit"
                className="text-white font-bold text-base bg-green-500 md:px-7 py-2 rounded-md hover:bg-transparent hover:text-rose-700 border hover:border-rose-800 hover:border-2 transition-colors duration-400 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
