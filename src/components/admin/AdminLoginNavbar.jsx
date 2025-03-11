import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const AdminLoginNavbar = () => {
  return (
    <nav className="w-full bg-gray-900 text-white p-4 fixed top-0 left-0 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between">
        <Link to="/" className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
          <FaHome /> Back to Home
        </Link>
      </div>
    </nav>
  );
};

export default AdminLoginNavbar;