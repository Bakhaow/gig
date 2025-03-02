import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import PrivateRoute from "./components/PrivateRoute.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import Profile from "./pages/user/Profile.jsx";
import AdminRoute from "./pages/admin/AdminRoute.jsx";
import UserList from "./pages/admin/UserList.jsx";
import Home from "./pages/Home.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CategoryList from "./pages/admin/CategoryList.jsx";
import OfferCreate from "./pages/admin/OfferCreation.jsx";
import AdminOfferList from "./pages/admin/OfferList.jsx";
import PublicOfferList from "./pages/offer/OfferList.jsx";
import OfferDetails from "./pages/offer/OfferDetails.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="offers" element={<PublicOfferList />} />
      <Route path="offers/:id" element={<OfferDetails />} />
      <Route index={true} path="/" element={<Home />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />}></Route>
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="createoffer" element={<OfferCreate />} />
        <Route path="offers" element={<AdminOfferList />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
