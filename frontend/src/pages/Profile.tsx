import { store } from "../store/states";
import null_picture from "../assets/null profile.jpg";
import { MdModeEditOutline } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../utils/cors";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineLike as Like } from "react-icons/ai";
import { FaRegComment as Comment } from "react-icons/fa6";
import { PiShareFatThin as Share } from "react-icons/pi";
import { CiMenuKebab as Menu } from "react-icons/ci";
import moment from "moment";
import type { User } from "../types";
import type { Post } from "../types";

interface StoreState {
  user: User;
  logged_user: (user: User) => void;
}

const getAuthHeader = () => ({
  headers: { token: localStorage.getItem("token") },
});

const Profile = () => {
  const { user, logged_user } = store() as StoreState;
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  const [userData, setUserData] = useState<User | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [editFirstName, setEditFirstName] = useState(user.firstname);
  const [editLastName, setEditLastName] = useState(user.lastname);

  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId, user._id]);

  const fetchUserData = async () => {
    try {
      const resp = await axios.get(
        `${baseUrl}/api/v1/profile/${userId || user._id}`,
        getAuthHeader(),
      );
      setUserData(resp.data.data);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err);
      message.error(err.response?.data?.message || "Failed to fetch user data");
    }
  };

  const fetchUserPosts = async () => {
    try {
      const resp = await axios.get(
        `${baseUrl}/api/v1/profile/post/${userId || user._id}`,
        getAuthHeader(),
      );
      setAllPosts(resp.data.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch posts");
    }
  };

  const handleNameSave = async () => {
    if (!editFirstName.trim() || !editLastName.trim()) {
      message.error("Firstname and Lastname are required");
      return;
    }
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/profile`,
        { firstname: editFirstName, lastname: editLastName },
        getAuthHeader(),
      );
      message.success(response.data.message);

      const updatedUser = {
        ...user,
        firstname: editFirstName,
        lastname: editLastName,
      };
      logged_user(updatedUser);
      setUserData(updatedUser);
      setIsEditingName(false);

      fetchUserPosts();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err);
      message.error(err.response?.data?.message || "Error updating name");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !repPassword) {
      message.error("Password fields are required");
      return;
    }
    if (newPassword !== repPassword) {
      message.error("Passwords don't match");
      return;
    }
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/password`,
        { current_password: currentPassword, new_password: newPassword },
        getAuthHeader(),
      );
      setCurrentPassword("");
      setNewPassword("")
      setRepPassword("");
      message.success(response.data.message);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err);
      message.error(err.response?.data?.message || "Failed to update password");
    }
  };

  const uploadFiles = async (file: File | undefined) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.put(
        `${baseUrl}/api/v1/profile-picture`,
        formData,
        getAuthHeader(),
      );
      message.success(response.data.message);
      logged_user({ ...user, profile_picture: response.data.url });
      setUserData((prev) =>
        prev ? { ...prev, profile_picture: response.data.url } : prev,
      );
      fetchUserPosts();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err);
      message.error(err.response?.data?.message || "Failed to upload image");
    }
  };

  const startEditing = (post: Post) => {
    setEditingPostId(post._id);
    setEditTitle(post.title);
    setEditDesc(post.description);
    setOpenMenuId(null);
  };

  const handleEditSave = async (id: string) => {
    if (!editTitle.trim() || !editDesc.trim()) {
      message.error("Title and description cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `${baseUrl}/api/v1/post/${id}`,
        { title: editTitle, description: editDesc },
        getAuthHeader(),
      );

      message.success("Post updated successfully");
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id
            ? { ...post, title: editTitle, description: editDesc }
            : post,
        ),
      );
      setEditingPostId(null);
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Error updating post");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/api/v1/post/${id}`, getAuthHeader());
      message.success("Post deleted successfully");
      setOpenMenuId(null);
      setAllPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Error deleting post");
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="px-7 py-1 bg-rose-500 text-white cursor-pointer rounded-md m-3 hover:bg-emerald-500 transition-colors duration-400"
      >
        Back
      </button>

      <div className="flex flex-col justify-center items-center mb-30">
        <div className="p-4 relative">
          <img
            src={userData?.profile_picture || null_picture}
            alt="profile"
            className="w-64 h-64 border rounded-full object-cover"
          />
          <input
            type="file"
            id="picture"
            className="hidden"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) uploadFiles(e.target.files[0]);
            }}
          />
          {userData?._id === user._id && (
            <label htmlFor="picture">
              <MdModeEditOutline className="absolute right-10 bottom-8 bg-slate-200 rounded-full h-10 w-10 p-3 cursor-pointer" />
            </label>
          )}
        </div>

        <div className="font-bold text-2xl flex flex-col gap-2 justify-center items-center">
          {isEditingName && userData?._id === user._id ? (
            <div className="flex flex-col gap-2 items-center mt-2">
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="border p-1 rounded outline-none text-center text-lg font-normal"
                placeholder="First Name"
              />
              <input
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className="border p-1 rounded outline-none text-center text-lg font-normal"
                placeholder="Last Name"
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setIsEditingName(false)}
                  className="text-sm bg-gray-200 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNameSave}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-2 items-center">
              {userData?.firstname} {userData?.lastname}
              {userData?._id === user._id && (
                <span
                  onClick={() => setIsEditingName(true)}
                  className="cursor-pointer"
                >
                  <MdModeEditOutline className="w-5 h-5" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {userData?._id === user._id && (
        <div className="border-t flex flex-col justify-center items-center gap-23 mb-45">
          <h1 className="font-bold text-3xl mt-20">Security and Privacy</h1>
          <form
            onSubmit={handlePasswordSubmit}
            className="flex flex-col justify-center items-center gap-3"
          >
            <input
              type="password"
              placeholder="Current Password"
              className="text-center min-w-md border rounded-md p-2 outline-none border-blue-400 hover:border-red-400 transition-colors duration-900"
              onChange={(e) => setCurrentPassword(e.target.value)}
              value={currentPassword}
            />
            <input
              type="password"
              placeholder="New Password"
              className="text-center min-w-md border rounded-md p-2 outline-none border-blue-400 hover:border-red-400 transition-colors duration-900"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
            <input
              type="password"
              placeholder="Repeat Password"
              className="text-center min-w-md border rounded-md p-2 outline-none border-blue-400 hover:border-red-400 transition-colors duration-900"
              onChange={(e) => setRepPassword(e.target.value)}
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
      )}

      {allPosts.length > 0 ? (
        allPosts.map((singlePost) => (
          <div
            key={singlePost?._id}
            className="border p-6 leading-loose rounded-lg shadow-sm w-full max-w-2xl flex flex-col justify-start items-start relative mx-auto mb-4"
          >
            <div className="flex justify-center items-center gap-4 w-full">
              <img
                className="h-12 w-12 rounded-full cursor-pointer object-cover"
                src={singlePost.userID?.profile_picture || null_picture}
                alt="user profile"
              />
              <div className="flex flex-col leading-tight flex-1">
                <div
                  className="absolute top-4 right-4 inline-block"
                  ref={(node) => {
                    menuRefs.current[singlePost._id] = node;
                  }}
                >
                  {user?._id === singlePost.userID?._id && (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId((prev) =>
                          prev === singlePost._id ? null : singlePost._id,
                        )
                      }
                      aria-expanded={openMenuId === singlePost._id}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Menu className="w-5 h-5 text-gray-700" />
                    </button>
                  )}

                  {openMenuId === singlePost._id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-50 flex flex-col py-1">
                      <button
                        type="button"
                        onClick={() => startEditing(singlePost)}
                        className="px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(singlePost._id)}
                        className="px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="font-bold cursor-pointer">
                  {singlePost.userID?.firstname} {singlePost.userID?.lastname}
                </div>

                <h1 className="text-gray-500 text-sm">
                  {moment(singlePost.createdAt).fromNow()}
                </h1>
              </div>
            </div>

            {editingPostId === singlePost._id ? (
              <div className="w-full mt-4 flex flex-col gap-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border rounded p-2 outline-none focus:border-blue-500"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full border rounded p-2 outline-none focus:border-blue-500 min-h-20 resize-none"
                />
                <div className="flex gap-3 justify-end mt-2">
                  <button
                    onClick={() => setEditingPostId(null)}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditSave(singlePost._id)}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold font-mono mt-4 w-full">
                  {singlePost.title}
                </h1>
                <p className="font-bold text-base text-gray-700 w-full whitespace-pre-wrap">
                  {singlePost.description}
                </p>
              </>
            )}

            <div className="flex gap-7 mt-4 border-t w-full pt-4">
              <Like className="h-5 w-5 text-black/70 cursor-pointer hover:text-blue-500 transition-colors" />
              <Comment className="h-5 w-5 text-black/50 cursor-pointer hover:text-blue-500 transition-colors" />
              <Share className="h-5 w-5 cursor-pointer hover:text-blue-500 transition-colors" />
            </div>
          </div>
        ))
      ) : (
        <div className="w-full text-center mt-10 text-gray-500 font-medium">
          No posts found
        </div>
      )}
    </div>
  );
};

export default Profile;
