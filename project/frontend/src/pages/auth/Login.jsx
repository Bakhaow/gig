import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { useGoogleLoginMutation } from "../../redux/api/googleApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import validator from "validator";

function Login() {
  const recaptchaRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [googleLogin] = useGoogleLoginMutation();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const userData = await googleLogin({
        token: credentialResponse.credential,
      }).unwrap();
      dispatch(setCredentials(userData));
      navigate(redirect);
      toast.success("Google login successful");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const recaptchaToken = await recaptchaRef.current.executeAsync();
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    // Sanitize email
    const sanitizedEmail = validator.escape(email.trim());
    if (!validator.isEmail(sanitizedEmail)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      const { data } = await login({
        email: sanitizedEmail,
        password,
        recaptchaToken,
      });

      dispatch(setCredentials(data));
      navigate(redirect);
      toast.success("Login successful");
    } catch (err) {
      toast.error(err.data?.message || err.error || "Login failed");
    }

    recaptchaRef.current.reset();
  };

  return (
    <div>
      <section className="pl-[10rem] mt-[7vh] flex flex-wrap">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
          <div className="mb-4">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                theme="filled_blue"
                size="large"
                text="signin_with"
                useOneTap
              />
            </GoogleOAuthProvider>
          </div>
          <form onSubmit={submitHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              size="invisible"
              className="mt-4"
            />

            <button
              disabled={isLoading}
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem] hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4">
            <p className="text-white">
              New Customer ?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-yellow-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
          alt=""
          className="h-[90vh] w-[53vw] xl:block md:hidden sm:hidden rounded-lg"
        />
      </section>
    </div>
  );
}

export default Login;
