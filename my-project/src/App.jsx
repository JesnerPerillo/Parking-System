import LandingPage from './LandingPage.jsx'
import StudentSignup from '././StudentSide/StudentSignup.jsx'
import StudentLogin from '././StudentSide/StudentLogin.jsx'
import StudentDashboard from '././StudentSide/StudentDashboard.jsx'
import StudentParkingSlot from '././StudentSide/StudentParkingSlot.jsx'
import StudentAccount from '././StudentSide/StudentAccount.jsx'
import FacultyStaffSignup from '././FacultyStaffSide/FacultyStaffSignup.jsx'
import FacultyStaffLogin from '././FacultyStaffSide/FacultyStaffLogin.jsx'
import FacultyStaffDashboard from '././FacultyStaffSide/FacultyStaffDashboard.jsx'
import FacultyStaffParkingSlot from '././FacultyStaffSide/FacultyStaffParkingSlot.jsx'
import FacultyStaffAccount from '././FacultyStaffSide/FacultyStaffAccount.jsx'
import AdminLogin from '././AdminSide/AdminLogin.jsx'
import AdminDashboard from '././AdminSide/AdminDashboard.jsx'
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
            <Route path="/studentaccount" element={<StudentAccount />} />
            <Route path="/studentlogin" element={<StudentLogin />} />
            <Route path="/facultystaffsignup" element={<FacultyStaffSignup />} />
            <Route path="/facultystafflogin" element={<FacultyStaffLogin />} />
            <Route path="/facultystaffdashboard" element={<FacultyStaffDashboard />} />
            <Route path="/facultystaffparkingslot" element={<FacultyStaffParkingSlot />} />
            <Route path="/facultystaffaccount" element={<FacultyStaffAccount />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

