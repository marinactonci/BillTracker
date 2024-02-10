import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard.tsx";
import Settings from "./Settings.tsx";
import Navbar from "./Navbar.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import Home from "./Home.tsx";
import Footer from "./Footer.tsx";
import Profiles from "./Profiles.tsx";
import NotFound from "./NotFound.tsx";

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
