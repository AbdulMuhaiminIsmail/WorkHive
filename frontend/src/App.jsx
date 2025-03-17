import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Auth Pages
import Register from "./pages/Register";
import Login from "./pages/login";

// Freelancer Pages
import Home from "./pages/freelancer/home";
import Bids from "./pages/freelancer/bids";
import Bid from "./pages/freelancer/bid";
import JobDetails from "./pages/freelancer/jobDetails";
import PostJob from "./pages/client/postJob";
// import Contracts from "./pages/freelancer/contracts";
// import Payments from "./pages/freelancer/payments";
// import Reviews from "./pages/freelancer/reviews";
// import Account from "./pages/freelancer/account";

// Routes
const router = createBrowserRouter([
    { path: "/", element: <Register /> },
    { path: "/login", element: <Login />},
    { path: "/home", element: <Home />}, 
    { path: "/bids", element: <Bids />},
    { path: "/bid", element: <Bid />},
    { path: "/jobDetails", element: <JobDetails />},
    { path: "/postJob", element: <PostJob />},
    // { path: "./contracts", element: <Contracts />},
    // { path: "./payments", element: <Payments />},
    // { path: "./reviews", element: <Reviews />},
    // { path: "./account", element: <Account />},
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
