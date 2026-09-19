import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { baseUrl } from "../utils/cors";
import { Header } from "./Header";
import { message } from "antd";
import moment from "moment";
import { AiOutlineLike as Like } from "react-icons/ai";
import { FaRegComment as Comment } from "react-icons/fa6";
import { PiShareFatThin as Share } from "react-icons/pi";

interface Post {
  _id: string;
  title: string;
  description: string;
  createdAt: string | number;
  profile_picture: any;
  userID: {
    firstname: string;
    lastname: string;
    profile_picture: string;
  };
}
const socket = io(`${baseUrl}`);

export const Form: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/post`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setPosts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !desc.trim()) {
      message.error("Both title and description are required.");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/api/v1/post`,
        {
          title,
          description: desc,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      setTitle("");
      setDesc("");
      message.success("post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleEdit = async (
    id: string,
    currentTitle: string,
    currentDesc: string,
  ) => {
    const promptTitle = prompt("Enter Updated Title", currentTitle);
    const promptDesc = prompt("Enter Updated Description", currentDesc);

    if (promptTitle === null || promptDesc === null) return;

    const updatedTitle = promptTitle.trim() || currentTitle;
    const updatedDesc = promptDesc.trim() || currentDesc;

    try {
      await axios.put(
        `${baseUrl}/api/v1/post/${id}`,
        {
          title: updatedTitle,
          description: updatedDesc,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
      message.success("Post updated successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      message.error("Error updating post");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/api/v1/post/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      fetchPosts();
      message.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
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
            Create Todo
          </button>
        </form>

        <div className="flex flex-col justify-center items-center gap-6 p-6">
          {posts.map((singlePost) => (
            <div
              key={singlePost._id}
              className="border p-6  leading-loose rounded-lg shadow-sm w-full flex flex-col justify-start items-start"
            >
              <div className="flex justify-center items-center gap-4">
                <img
                  className="h-12 w-12 rounded-full"
                  src={singlePost.userID.profile_picture}
                />
                <div className="flex flex-col leading-tight">
                  <h1 className="font-bold">
                    {singlePost.userID.firstname} {singlePost.userID.lastname}
                  </h1>
                  <h1 className="text-gray-500 text-sm">
                    {moment(singlePost.createdAt).fromNow()}
                  </h1>
                </div>
              </div>
              <h1 className="text-2xl font-bold font-mono text-center mt-3">
                {singlePost.title}
              </h1>
              <p className="font-bold text-base text-center text-gray-700">
                {singlePost.description}
              </p>
              <div className="flex gap-7 mt-2">
                <Like className="h-5 w-5 text-black/70 cursor-pointer" />
                <Comment className="h-5 w-5 text-black/50 cursor-pointer" />
                <Share className="h-5 w-5 cursor-pointer" />
              </div>
              <div className="flex justify-center items-center gap-4 text-base mt-3">
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(
                      singlePost._id,
                      singlePost.title,
                      singlePost.description,
                    )
                  }
                  className="cursor-pointer border px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(singlePost._id)}
                  className="cursor-pointer px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
