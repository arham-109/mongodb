import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { message } from "antd";
import moment from "moment";
import { AiOutlineLike as Like } from "react-icons/ai";
import { FaRegComment as Comment } from "react-icons/fa6";
import { PiShareFatThin as Share } from "react-icons/pi";
import { CiMenuKebab as Menu } from "react-icons/ci";
import { baseUrl } from "../utils/cors";
import { Header } from "./Header";

interface Post {
  _id: string;
  title: string;
  description: string;
  createdAt: string | number;
  userID: {
    firstname: string;
    lastname: string;
    profile_picture: string;
  };
}

const socket = io(baseUrl);

export const Form: React.FC = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/post`, {
        headers: { token: localStorage.getItem("token") },
      });
      setPosts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      message.error("Failed to load posts.");
    }
  };

  useEffect(() => {
    fetchPosts();

    socket.on("post_created", (newPost: Post) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    return () => {
      socket.off("post_created");
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openMenuId) return;

      const menuRef = menuRefs.current[openMenuId];
      if (menuRef && !menuRef.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !desc.trim()) {
      message.error("Both title and description are required.");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/api/v1/post`,
        { title, description: desc },
        { headers: { token: localStorage.getItem("token") } },
      );
      setTitle("");
      setDesc("");
      message.success("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      message.error("Error creating post");
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
        { headers: { token: localStorage.getItem("token") } },
      );
      
      message.success("Post updated successfully");
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id
            ? { ...post, title: editTitle, description: editDesc }
            : post
        )
      );
      
      setEditingPostId(null); 
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Error updating post");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/api/v1/post/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      
      message.success("Post deleted successfully");
      setOpenMenuId(null);
      
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Error deleting post");
    }
  };

  return (
    <>
      <Header />
      <div className="mt-20">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center p-6 max-w-lg mx-auto"
        >
          <input
            type="text"
            value={title}
            placeholder="Enter Title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-center border rounded m-2 p-2 hover:border-blue-500 outline-none focus:border-rose-500 transition-colors duration-300"
          />
          <input
            type="text"
            value={desc}
            placeholder="Enter Description"
            onChange={(e) => setDesc(e.target.value)}
            className="w-full text-center border rounded m-2 p-2 hover:border-blue-500 outline-none focus:border-rose-500 transition-colors duration-300"
          />
          <button
            type="submit"
            className="bg-violet-500 text-white px-5 py-2 m-3 rounded-lg cursor-pointer hover:bg-violet-700 transition-colors duration-300"
          >
            Create Post
          </button>
        </form>

        <div className="flex flex-col justify-center items-center gap-6 p-6">
          {posts.map((singlePost) => (
            <div
              key={singlePost._id}
              className="border p-6 leading-loose rounded-lg shadow-sm w-full max-w-2xl flex flex-col justify-start items-start relative"
            >
              <div className="flex justify-center items-center gap-4 w-full">
                <img
                  className="h-12 w-12 rounded-full"
                  src={singlePost.userID.profile_picture}
                  alt="user profile"
                />
                <div className="flex flex-col leading-tight flex-1">
                  
                  <div
                    className="absolute top-4 right-4 inline-block"
                    ref={(node) => {
                      menuRefs.current[singlePost._id] = node;
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId((prev) =>
                          prev === singlePost._id ? null : singlePost._id
                        )
                      }
                      aria-expanded={openMenuId === singlePost._id}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Menu className="w-5 h-5 text-gray-700" />
                    </button>

                    {openMenuId === singlePost._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-50 flex flex-col py-1">
                        <button
                          type="button"
                          onClick={() => startEditing(singlePost)}
                          className="px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(singlePost._id)}
                          className="px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <h1 className="font-bold">
                    {singlePost.userID.firstname} {singlePost.userID.lastname}
                  </h1>
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
                    className="w-full border rounded p-2 outline-none focus:border-blue-500 min-h-20"
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
          ))}
        </div>
      </div>
    </>
  );
};