import { LockOutlined, MessageOutlined, SettingOutlined, SwapOutlined } from "@ant-design/icons"
import { FaUserPlus } from "react-icons/fa"
import { IoMdMore } from "react-icons/io"
const settingList = [
    {
        _id: 1,
        name: "Cài đặt chụng",
        icon : <SettingOutlined />
    },
    {
        _id: 3,
        name: "Quyền riêng tư",
        icon : <LockOutlined />
    },
    {
        _id: 3,
        name: "Tiện ích",
        icon : <SwapOutlined />
    },
    {
        _id: 3,
        name: "Tin nhắn nhanh.",
        icon : <MessageOutlined />
    }
]
const SettingList = () => {

    return <div className="w-90 bg-white h-screen flex flex-col border-r">
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



          {/* Chat Items */}
          <div className="overflow-auto flex-1">

            {settingList.map((item, index) => {
                return <>
                    <div key={index} className="text-start px-3 py-5 font-[600] text-[15px] hover:bg-gray-200">
                        {item.icon}
                        <span className="ml-4">{item.name}</span>
                    </div>
                </>
             })}
          </div>
        </div>
}


export default SettingList
