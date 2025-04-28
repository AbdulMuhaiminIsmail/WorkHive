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
import Account from "./pages/freelancer/account";
import BidDetails from "./pages/freelancer/bidDetails";
import Contracts from "./pages/freelancer/contracts";
import Reviews from "./pages/freelancer/reviews";
import Payments from "./pages/freelancer/payments";

// Routes
const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/register", element: <Register />},
    { path: "/home", element: <Home />}, 
    { path: "/bids", element: <Bids />},
    { path: "/bid", element: <Bid />},
    { path: "/jobDetails", element: <JobDetails />},
    { path: "/postJob", element: <PostJob />},
    { path: "/account", element: <Account />},
    { path: "/bidDetails/:id", element: <BidDetails />},
    { path: "/contracts", element: <Contracts />},
    { path: "/reviews", element: <Reviews />},
    { path: "/payments", element: <Payments />},
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
