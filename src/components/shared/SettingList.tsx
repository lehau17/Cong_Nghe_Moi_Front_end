import { LockOutlined, MessageOutlined, SettingOutlined, SwapOutlined } from "@ant-design/icons";
import { FaUserPlus } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const settingList = [
  {
    _id: 1,
    name: "Cài đặt chung",
    icon: <SettingOutlined />,
    path: "/setting/general"
  },
  {
    _id: 2,
    name: "Quyền riêng tư",
    icon: <LockOutlined />,
    path: "/setting/private-permission"
  },
  {
    _id: 3,
    name: "Tiện ích",
    icon: <SwapOutlined />,
    path: "/setting/util"
  },
  {
    _id: 4,
    name: "Tin nhắn nhanh",
    icon: <MessageOutlined />,
    path: "/setting/message"
  }
];

const SettingList = () => {
  const navigate = useNavigate();

  return (
    <div className="w-90 bg-white h-screen flex flex-col border-r">
      {/* Header */}
      <div className="p-2 flex justify-between items-center border-b">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm"
          className="w-full bg-gray-100 px-2 py-1 rounded-lg outline-none"
        />
        <FaUserPlus className="text-gray-600 ml-3 cursor-pointer text-xl" />
        <IoMdMore className="text-gray-600 ml-3 cursor-pointer text-xl" />
      </div>

      {/* Setting Items */}
      <div className="overflow-auto flex-1">
        {settingList.map((item) => (
          <div
            key={item._id}
            className="text-start px-3 py-5 font-[600] text-[15px] hover:bg-gray-200 cursor-pointer flex items-center"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="ml-4">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingList;
