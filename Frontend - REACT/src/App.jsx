// import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/css/style.css";
import Landing_Page from "./pages/Landing_Page";
import Registration_Page from "./pages/Registration_Page";
import Login_Page from "./pages/Login_Page";
import Home_Page from "./pages/Home_Page";
import AuthProvider from "./context/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import CategoryNews from "./pages/Category_News";
import CheckByTitle from "./pages/Check_By_Title";
import NewsQuiz from "./pages/News_Quiz";
import FeedbackDashboard from "./pages/FeedbackDashboard";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing_Page />} />
            <Route path="/register" element={<Registration_Page />} />
            <Route path="/login" element={<Login_Page />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home_Page />
                </ProtectedRoute>
              }
            />
            <Route path="/category/:category" element={<ProtectedRoute><CategoryNews /></ProtectedRoute>} />
            <Route path="/checkbytitle" element={<ProtectedRoute><CheckByTitle /></ProtectedRoute>} />
            <Route path="/newsquiz" element={<ProtectedRoute><NewsQuiz /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><FeedbackDashboard /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
