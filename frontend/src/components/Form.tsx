import React, { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  _id: string;
  title: string;
  description: string;
}

export const Form: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);

  const API_URL = "https://mongodb-todo.up.railway.app/api/v1/post";

  const fetchPosts = async () => {
    try {
      // Clean GET request without query params
      const response = await axios.get(API_URL);
      setPosts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !desc.trim()) {
      alert("Both title and description are required.");
      return;
    }

    try {
      await axios.post(API_URL, {
        title,
        description: desc,
      });
      setTitle("");
      setDesc("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleEdit = async (id: string, currentTitle: string, currentDesc: string) => {
    const promptTitle = prompt("Enter Updated Title", currentTitle);
    const promptDesc = prompt("Enter Updated Description", currentDesc);

    if (promptTitle === null || promptDesc === null) return;

    const updatedTitle = promptTitle.trim() || currentTitle;
    const updatedDesc = promptDesc.trim() || currentDesc;

    try {
      await axios.put(`${API_URL}/${id}`, {
        title: updatedTitle,
        description: updatedDesc,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
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

      <div className="flex justify-center items-start gap-6 p-6 flex-wrap">
        {posts.map((singlePost) => (
          <div
            key={singlePost._id}
            className="border p-6 tracking-widest leading-loose rounded-lg shadow-sm min-w-[250px]"
          >
            <h1 className="text-2xl font-bold font-mono text-center">
              {singlePost.title}
            </h1>
            <p className="font-bold text-base text-center text-gray-700">
              {singlePost.description}
            </p>
            <div className="flex justify-center items-center gap-4 text-base mt-3">
              <button
                type="button"
                onClick={() =>
                  handleEdit(
                    singlePost._id,
                    singlePost.title,
                    singlePost.description
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
    </>
  );
};