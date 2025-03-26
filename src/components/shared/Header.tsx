import { useLocation } from "react-router-dom";


const Header = ({title}:{title:string}) => {
    const { pathname } = useLocation();
    console.log("check pathname", pathname)
    return (
        <div className="bg-white p-4 border-b shadow-md flex items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        </div>
    );
};

export default Header;
