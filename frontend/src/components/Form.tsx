import React, { useEffect, useState } from "react";
import axios from "axios";
export const Form: React.FC = () => {
  const [title, set_title] = useState<string | number>("");
  const [desc, set_desc] = useState<string | number>("");
  const [post, set_posts] = useState<any>();

  useEffect(() => {
    fetch_post();
  }, []);

  const fetch_post = async () => {
    try {
      const response = await axios.get("https://mongodb-todo.up.railway.app/api/v1/post", {
        params: {
          title,
          desc,
        },
      });
      set_posts(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handle_Submit = async (e: any) => {
    e.preventDefault();

    if (!title) {
      alert("Title is required");
      return;
    }

    if (!desc) {
      alert("Description is required");
      return;
    }

    try {
      await axios.post("https://mongodb-todo.up.railway.app/api/v1/post", {
        title: title,
        description: desc,
      });
      set_title("");
      set_desc("");
      alert("post created successfully");
      fetch_post();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (
    id: any,
    title: string | number,
    desc: string | number,
  ) => {
    const promptTitle = prompt("Enter Updated Title", `${title}`);
    const promptDesc = prompt("Enter Updated Description", `${desc}`);

    if (promptTitle === null || promptDesc === null) return;

    const updatedTitle = promptTitle.trim() !== "" ? promptTitle :title;
    const updatedDesc = promptDesc.trim() !== "" ? promptDesc : desc;
    try {
      await axios.put(`https://mongodb-todo.up.railway.app/api/v1/post/${id}`, {
        title: updatedTitle,
        description: updatedDesc,
      });
      fetch_post();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(`https://mongodb-todo.up.railway.app/api/v1/post/${id}`);
      fetch_post();
      alert("post deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handle_Submit}
        className="flex flex-col justify-center items-center p-25"
      >
        <input
          type="text"
          value={title}
          placeholder="Enter Title"
          onChange={(e) => set_title(e.target.value)}
          className="min-w-full text-center border rounded m-2 p-1 hover:border-blue-500 outline-none focus:border-rose-500 transition-colors duration-300"
        />
        <input
          type="text"
          value={desc}
          placeholder="Enter Description"
          onChange={(e) => set_desc(e.target.value)}
          className="min-w-full text-center border rounded m-2 p-1 hover:border-blue-500 outline-none focus:border-rose-500 transition-colors duration-300"
        />
        <button
          type="submit"
          className="bg-violet-500 text-white px-5 py-2 m-3 rounded-lg cursor-pointer hover:bg-violet-700 transition-colors duration-300"
        >
          Create Todo
        </button>
      </form>
      <div className="flex justify-start itmes-start gap-6 p-6 flex-wrap">
        {post?.map((singlePost: any) => (
          <div
            key={singlePost._id}
            className="border p-6 tracking-widest leading-loose"
          >
            <h1 className="text-2xl font-bold font-mono text-center">
              {singlePost.title}
            </h1>
            <p className="font-bold text-base text-center">
              {singlePost.description}
            </p>
            <div className="flex justify-center items-center gap-4 text-base mt-3 ">
              <button
                type="button"
                onClick={() =>
                  handleEdit(
                    singlePost._id,
                    singlePost.title,
                    singlePost.description,
                  )
                }
                className="cursor-pointer border px-4 py-2 rounded-md bg-green-500 hover:bg-rose-700 transition-colors duration-400 text-white "
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(singlePost._id)}
                className="cursor-pointer px-4 py-2 rounded-md bg-rose-700 text-white hover:bg-green-500 transition-colors duration-400"
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
