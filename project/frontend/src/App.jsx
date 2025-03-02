import { Outlet } from "react-router-dom";
import Navigation from "./pages/auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer className={"mt-[7vh]"} />
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
}

export default App;
