import { useLocation, useParams } from "react-router-dom";
const chatNames: { [key: string]: string } = {
  "1": "DSA",
  "2": "Cộng đồng Backend",
  "3": "Nghĩa",
};

const Header = ({title}:{title:string}) => {
    const { pathname } = useLocation();
    console.log("check pathname", pathname)
    const { chatId } = useParams();
    return (
        <div className="bg-white p-4 border-b shadow-md flex items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        </div>
    );
};

export default Header;
