import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
// import FindDonors from "./pages/FindDonors";
// import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";
import FindDonors from "./pages/FindDonors";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
<Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />
{/* <Route path="/find-donors" element={<FindDonors />} />
<Route path="/notifications" element={<Notifications />} /> */}
 <Route path="/find-donors" element={<FindDonors />} />
      </Routes>
    </Router>
  );
}

export default App;
