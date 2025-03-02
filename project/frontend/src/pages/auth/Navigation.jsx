import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiFillBook,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

function Navigation() {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-row justify-between text-white bg-[#1A1A1A] w-[100vw] h-[7vh] fixed 
      `}
      id="navigation-container"
    >
      <div className="flex flex-row justify-center space-x-[3rem] ml-[2rem]">
        <Link to="/" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-y-[-.5vh] hover:text-yellow-500 font-bold">
            <AiOutlineHome className="mr-2" size={26} />
            <span className="">HOME</span>{" "}
          </div>
        </Link>
        <Link to="/offers" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-y-[-.5vh] hover:text-yellow-500 font-bold">
            <AiFillBook className="mr-2" size={26} />
            <span className="">OFFERS</span>{" "}
          </div>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center focus:outline-none mr-[2rem] mt-[1rem] hover:text-yellow-500 font-bold"
        >
          {userInfo ? <span>{userInfo.username}</span> : <></>}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 mt-1 ${
                dropdownOpen ? "transform-rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`fixed right-0 mt-[7vh] space-y-[1rem] bg-[#1A1A1A] text-white text-center px-4 py-2 font-semibold ${
              !userInfo.isAdmin ? "mt-[20vh]" : "mt-[2vh]"
            } `}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:text-yellow-500"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:text-yellow-500"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:text-yellow-500"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 hover:text-yellow-500"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul className="flex items-center focus:outline-none mr-[2rem] mt-[.5rem] space-x-[3rem]">
            <li>
              <Link
                to="/login"
                className="flex items-center transition-transform transform hover:translate-y-[-.5vh] space-x-[1rem] hover:text-yellow-500"
              >
                <AiOutlineLogin className="" size={22} />
                <span className="font-bold">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center transition-transform transform hover:translate-y-[-.5vh] space-x-[1rem] hover:text-yellow-500"
              >
                <AiOutlineUserAdd size={22} />
                <span className="font-bold">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Navigation;
