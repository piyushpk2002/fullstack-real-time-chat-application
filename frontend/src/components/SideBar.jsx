
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SideBarSkeleton";
import { Users } from "lucide-react";

const SideBar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const  { onlineUsers }  = useAuthStore();
  

  console.log(onlineUsers);
  
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const handleFiltredUsers = ()=>{
    console.log('onlineUsers')
    setShowOnlineOnly((prev) => (!prev))
  }

  const fileterdUsers = showOnlineOnly?users.filter((user) => onlineUsers.includes(user._id)):users

  useEffect(() => {
    getUsers();
    console.log(users);
    
  }, [getUsers]);

 
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block border-b">Contacts</span>
        </div>
      {/* Online Users filter || */}
       <div className="flex items-center mt-2 gap-4 flex-col lg:flex-row">
          <div className="mt-2 relative flex ">
            <div className={`border rounded-xl w-[35px] h-[20px] relative flex items-center transition duration-500 ease-in-out cursor-pointer`} onClick={handleFiltredUsers}>
              <div className={`w-[22px] h-[22px] rounded-full absolute ml-[-1px] mr-[-1px]  filter drop-shadow-xl   transition duration-200 ease  ${showOnlineOnly? "bg-blue-600 translate-x-[15px] ": "bg-gray-600"}`}>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center h-full mt-1">
            <p className={`${showOnlineOnly?"hidden":""}`}> Show Online users only</p>
            <p className={`${showOnlineOnly?"":"hidden"}`}>{onlineUsers.length-1} Online</p>
          </div>
        </div> 
        
      </div>

      <div className="overflow-y-auto w-full py-3">
        
        {(fileterdUsers?.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {Array.isArray(onlineUsers)?onlineUsers.includes(user?._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              ):''}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {Array.isArray(onlineUsers)?onlineUsers.includes(user._id) ? "Online" : "Offline":''}
              </div>
            </div>
          </button>
        )))}

        
      </div>
    </aside>
  );
};
export default SideBar;
