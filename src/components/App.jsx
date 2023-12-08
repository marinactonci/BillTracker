import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard.tsx";
import Settings from "./settings/Settings.tsx";
import Navbar from "./Navbar.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import Home from "./Home.tsx";
import Footer from "./Footer.tsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/settings" Component={Settings} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
