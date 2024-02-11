import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx";
import Settings from "./pages/Settings.tsx";
import Navbar from "./components/Navbar.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Home from "./pages/Home.tsx";
import Footer from "./components/Footer.tsx";
import Profiles from "./pages/Profiles.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/profiles" Component={Profiles} />
        <Route path="/settings" Component={Settings} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="*" Component={NotFound} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
