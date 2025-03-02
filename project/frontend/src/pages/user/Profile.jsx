import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import DOMPurify from "dompurify";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateProfile, { isLoading }] = useProfileMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setUsername(DOMPurify.sanitize(userInfo.username));
      setEmail(DOMPurify.sanitize(userInfo.email));
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const sanitizedUsername = DOMPurify.sanitize(username);
        const sanitizedEmail = DOMPurify.sanitize(email);

        const { data } = await updateProfile({
          username: sanitizedUsername,
          email: sanitizedEmail,
          password,
        });
        dispatch(setCredentials(data));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>

          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-white mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="form-input p-4 rounded-sm w-full"
                id="username"
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="form-input p-4 rounded-sm w-full"
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="form-input p-4 rounded-sm w-full"
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-white mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="form-input p-4 rounded-sm w-full"
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-yellow-200 text-yellow-500 py-2 px-4 rounded hover:bg-yellow-600 dark:bg-yellow-200 dark:text-yellow-500 hover:bg-yellow-600 hover:text-yellow-100"
                disabled={isLoading}
              >
                Update
              </button>
              <Link
                to="/user-orders"
                className="bg-yellow-600 text-yellow-200 py-2 px-4 rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:text-yellow-200 hover:bg-yellow-100 hover:text-yellow-500"
              >
                My Orders
              </Link>
            </div>
          </form>
        </div>
        {isLoading && <Loader />}
      </div>
    </div>
  );
}

export default Profile;
