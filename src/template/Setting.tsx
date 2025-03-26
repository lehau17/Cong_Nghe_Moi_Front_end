import SettingList from "@/components/shared/SettingList"
import Sidebar from "@/components/shared/Sidebar"

const SettingTemplate = () => {
    return <>
       <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      <SettingList />

      <div className="flex flex-col flex-1 h-screen bg-gray-200">

        {/* Nội dung động */}
      </div>
    </div>
    </>
}

export default SettingTemplate
