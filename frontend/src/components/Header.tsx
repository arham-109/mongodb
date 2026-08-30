import { store } from "../store/states";

export const Header = () => {
  const { loggedOut_user, user }: any = store();
  const handleLogout = () => {
    localStorage.removeItem("token");
    loggedOut_user();
  };
  return (
    <div className="flex justify-between items-center p-3 bg-gray-500/60 backdrop-blur-md text-shadow-gray-700 text-base uppercase font-bold fixed top-0 left-0 w-full">
      <h1 className="w-30 lg:max-w-fit truncate">
        {user?.firstname} {user?.lastname}
      </h1>
      <h1 className="text-center text-3xl font-bold font-sans m-3">
        Generate Posts
      </h1>
      <button
        onClick={handleLogout}
        className="cursor-pointer px-5 py-2 bg-gray-700 rounded-lg text-slate-300 hover:bg-gray-900 transition-colors duration-400"
      >
        Logout
      </button>
    </div>
  );
};
