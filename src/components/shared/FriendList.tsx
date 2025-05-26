import { UserAddOutlined, UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { FaUserPlus } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { NavigateFunction, useNavigate } from "react-router-dom";

const typeFriendList = [
    {
        _id: 1,
        name: "Danh sách bạn bè",
        icon: <UserOutlined />,
        onClick: (navigate: NavigateFunction) => {
            navigate("")
        }
    },
    {
        _id: 2,
        name: "Danh sách nhóm",
        icon: <UsergroupAddOutlined />,
        onClick: (navigate: NavigateFunction) => {
            navigate("groups")
        }
    },
    {
        _id: 3,
        name: "Lời mời kết bạn",
        icon: <UserAddOutlined />,
        onClick: (navigate: NavigateFunction) => {
            navigate("friend-request")
        }
    }
]


const FriendList = () => {
    const navigate = useNavigate()
    return (
        <div className="w-90 bg-white h-screen flex flex-col border-r">
            {/* Header */}
            <div className="p-2 flex justify-between items-center border-b">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm"
                    className="w-full bg-gray-100 px-2 py-2 rounded-lg outline-none"
                />
                <FaUserPlus className="text-gray-600 ml-3 cursor-pointer text-xl" />
                <IoMdMore className="text-gray-600 ml-3 cursor-pointer text-xl" />
            </div>


            {/* Chat Items */}
            <div className="overflow-auto flex-1">
                {typeFriendList.map((type) => (
                    <div
                        key={type._id}
                        className={`flex items-center px-4 py-4 cursor-pointer hover:bg-gray-100 gap-4 `}
                        onClick={() => {
                            type.onClick(navigate)
                        }}

                    >
                        {type.icon}
                        <span className="font-[555]">{type.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendList;
