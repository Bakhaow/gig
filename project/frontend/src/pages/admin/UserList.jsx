import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";
import { useLocation } from "react-router";

function UserList() {
  const location = useLocation();
  const { data, refetch, isLoading, error } = useGetUsersQuery();

  const users = data?.data || [];
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const editHandler = (userId, username, email) => {
    setEditableUserId(userId);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error.data.message || error.message);
      }
    }
  };

  const updateHandler = async (userId) => {
    try {
      const updatedUser = {
        _id: userId,
        username: editableUserName,
        email: editableUserEmail,
      };
      await updateUser(updatedUser).unwrap();
      editHandler(null, "", "");
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error.data.message || error.message);
    }
  };

  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  return (
    <div className="p-4 mt-[7vh] ml-[2rem]">
      <AdminMenu />
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error.data.message || error.message}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) &&
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="border px-4 py-2">{user._id}</td>
                    <td className="border px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) =>
                              setEditableUserName(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-2 text-white font-bold py-2 px-4 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}{" "}
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onChange={() => updateHandler(user._id)}
                            className="ml-2 text-white font-bold py-2 px-4 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <p>{user.email}</p>
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {user.isAdmin ? (
                        <FaCheck className="ml-[1rem] text-green-500" />
                      ) : (
                        <FaTimes className="ml-[1rem] text-red-500" />
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex">
                          <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={() => updateHandler(user._id)}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                              editHandler(null, null, null);
                            }}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                              editHandler(user._id, user.username, user.email);
                            }}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {!user.isAdmin && (
                        <div className="flex">
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserList;
