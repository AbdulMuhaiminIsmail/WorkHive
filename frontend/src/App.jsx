import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/login";
import Home from "./pages/home";

const router = createBrowserRouter([
    { path: "/", element: <Register /> },
    { path: "/login", element: <Login />},
    { path: "/home", element: <Home />}
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
