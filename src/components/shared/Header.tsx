import { useParams } from "react-router-dom";

const chatNames: { [key: string]: string } = {
  "1": "DSA",
  "2": "Cộng đồng Backend",
  "3": "Nghĩa",
};

const Header = () => {
  const { chatId } = useParams();
  return (
    <div className="bg-white p-4 border-b shadow-md flex items-center">
      <h2 className="text-lg font-semibold">{chatNames[chatId || "1"]}</h2>
    </div>
  );
};

export default Header;
