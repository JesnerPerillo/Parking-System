import LandingPage from './LandingPage.jsx'
import StudentSignup from '././StudentSide/StudentSignup.jsx'
import StudentLogin from '././StudentSide/StudentLogin.jsx'
import StudentDashboard from '././StudentSide/StudentDashboard.jsx'
import StudentParkingSlot from '././StudentSide/StudentParkingSlot.jsx'
import FacultyStaffSignup from '././FacultyStaffSide/FacultyStaffSignup.jsx'
import FacultyStaffLogin from '././FacultyStaffSide/FacultyStaffLogin.jsx'
import AdminLogin from '././AdminSide/AdminLogin.jsx'
import './../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

export default function App(){


  return(
    <>
      <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/studentsignup" element={<StudentSignup />} />
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route path="/studentparkingslot" element={<StudentParkingSlot />} />
            <Route path="/studentlogin" element={<StudentLogin />} />
            <Route path="/facultystaffsignup" element={<FacultyStaffSignup />} />
            <Route path="/facultystafflogin" element={<FacultyStaffLogin />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
        </Routes>
      </Router>
    </>
  );
}

