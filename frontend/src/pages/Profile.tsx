import { store } from "../store/states";
import null_picture from "../assets/null profile.jpg";
import { MdModeEditOutline } from "react-icons/md";
import { useState, type FormEvent } from "react";
import axios from "axios";
import { baseUrl } from "../utils/cors";
import { message } from "antd";

const Profile = () => {
  const { user, logged_user }: any = store();
  const [currentPassword, set_currentPassword] = useState("");
  const [newPassword, set_newPassword] = useState("");
  const [repPassword, set_repPassword] = useState("");

  const profile_name = async (e: FormEvent) => {
    e.preventDefault();
    const firstname = prompt("Enter Firstname", user.firstname);
    const lastname = prompt("Enter your lastname", user.lastname);
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/profile`,
        {
          firstname: firstname,
          lastname: lastname,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      message.success(response.data.message);
      logged_user({ ...user, firstname, lastname });
    } catch (error: any) {
      console.error(error);
      message.error(error.response.data.message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !repPassword) {
      message.error("Password fields are required");
      return;
    }
    if (newPassword !== repPassword) {
      message.error("Password don't match");
      return;
    }
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      set_currentPassword("");
      set_newPassword("");
      set_repPassword("");
      message.success(response.data.message);
      return;
    } catch (error: any) {
      console.error(error);
      message.error(error.response.data.message);
    }
  };
  const uploadFiles = async (file: any) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.put(
        `${baseUrl}/api/v1/profile-picture`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      message.success(response.data.message);
      logged_user({
        ...user,
        profile_picture: response.data.url,
      });
    } catch (error: any) {
      console.error(error);
      message.error(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-30">
        <h1 className="text-4xl p-4 w-full font-bold text-center">
          My Profile
        </h1>
        <div className="p-4 relative">
          <img
            src={user.profile_picture || null_picture}
            alt="profile"
            className="w-64 h-64 border rounded-full"
          />
          <input
            type="file"
            id="picture"
            className="hidden"
            accept="image/*"
            onChange={(e: any) => uploadFiles(e.target.files[0])}
          />
          <label htmlFor="picture">
            <MdModeEditOutline className="absolute right-10 bottom-8 bg-slate-200 rounded-full h-10 w-10 p-3 cursor-pointer" />
          </label>
        </div>
        <h1 className="font-bold text-2xl flex flex-row gap-2 justify-center">
          {user.firstname} {user.lastname}
          <span onClick={profile_name} className="cursor-pointer">
            <MdModeEditOutline />
          </span>
        </h1>
      </div>
      <div className="border-t flex flex-col justify-center items-center gap-23 mb-45">
        <h1 className="font-bold text-3xl mt-20">Security and Privacy</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-3"
        >
          <input
            type="text"
            placeholder="Current Password"
            className="text-center min-w-md border rounded-md p-2 outline-none border-blue-400 hover:border-red-400 transition-colors duration-900"
            onChange={(e: any) => set_currentPassword(e.target.value)}
            value={currentPassword}
          />
          <input
            type="text"
            placeholder="New Password"
            className="text-center min-w-md border rounded-md p-2 outline-none border-blue-400 hover:border-red-400 transition-colors duration-900"
            onChange={(e: any) => set_newPassword(e.target.value)}
            value={newPassword}
          />
          <input
            type="text"
            placeholder="Repeat Password"
            className="text-center min-w-md border rounded-md p-2 outline-none border-blue-400 hover:border-red-400 transition-colors duration-900"
            onChange={(e: any) => set_repPassword(e.target.value)}
            value={repPassword}
          />
          <button
            type="submit"
            className="mt-3 px-5 py-1 bg-blue-400 text-white rounded-md cursor-pointer hover:bg-green-500 transition-colors duration-400"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
