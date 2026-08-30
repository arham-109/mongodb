import axios from "axios";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/cors";

const Signup = () => {
  const [firstname, set_firstname] = useState("");
  const [lastname, set_lastname] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!firstname) {
        alert("Firstname is required");
        return;
      }
      if (!lastname) {
        alert("Lastname is required");
        return;
      }
      if (!email) {
        alert("email is required");
      }
      if (!password) {
        alert("Password is required");
      }

      await axios.post(`${baseUrl}/api/v1/signup`, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      });
      alert("Signup  successfull");
      navigate("/");
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center md:min-h-screen">
        <div className="rounded-lg px-15 py-34 ">
          <form onSubmit={handleSignup} className="flex flex-col gap-7">
            <h1 className="p-5 text-3xl md:text-4xl font-bold text-center tracking-widest">
              Signup
            </h1>
            <input
              type="text"
              placeholder="Enter Your Firstname"
              value={firstname}
              onChange={(e) => set_firstname(e.target.value)}
              className="border border-blue-400 max-w-md rounded-lg outline-none p-2 hover:border-rose-600 focus:border-green-700 transition-colors duration-400 md: min-w-md text-center text-base"
            />
            <input
              type="text"
              placeholder="Enter Your Lastname"
              value={lastname}
              onChange={(e) => set_lastname(e.target.value)}
              className="border border-blue-400 max-w-md rounded-lg outline-none p-2 hover:border-rose-600 focus:border-green-700 transition-colors duration-400 md: min-w-md text-center text-base"
            />
            <input
              type="text"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => set_email(e.target.value)}
              className="border border-blue-400 max-w-md rounded-lg outline-none p-2 hover:border-rose-600 focus:border-green-700 transition-colors duration-400 md: min-w-md text-center text-base"
            />
            <input
              type="text"
              value={password}
              onChange={(e) => set_password(e.target.value)}
              placeholder="Enter your password"
              className="border border-blue-400 max-w-md rounded-lg outline-none p-2 hover:border-rose-600 focus:border-green-700 transition-colors duration-400 md: min-w-md text-center text-base"
            />
            <div>
              <p className="text-center">
                Already have an account? <Link to="/login">Login now</Link>
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

export default Signup;
