import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        className={`${
          isOpen ? "top-[8vh] right-2" : "top-[10vh] right-7"
        } bg-[#151515] p-2 fixed rounded-lg`}
        style={{ zIndex: 1000 }}
        onClick={toggle}
      >
        {isOpen ? (
          <FaTimes className="text-white" />
        ) : (
          <>
            <div className="w-6 h-1 bg-gray-400 my-1"></div>
            <div className="w-6 h-1 bg-gray-400 my-1"></div>
            <div className="w-6 h-1 bg-gray-400 my-1"></div>
          </>
        )}
      </button>

      {isOpen && (
        <section className="bg-[#151515] p-4 fixed right-7 top-[8vh] rounded-lg">
          <ul>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Manage Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/createoffer"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Create Offer
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/offers"
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Manage Offers
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
}

export default AdminMenu;
