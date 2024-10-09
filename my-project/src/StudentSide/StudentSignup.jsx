import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideImg from '../Pictures/sideimg.png';
import { IoEyeOff, IoEye  } from "react-icons/io5";
import { ImSpinner2 } from 'react-icons/im';

export default function StudentSignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullname: '',
    email: '',
    yearsection: '',
    course: '',
    vehicleType: '',
    plateNumber: '',
    password: '',
    license: null,
    orcr: null,
    cor: null
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await axios.post('https://skyblue-clam-769210.hostingersite.com/studentsignup.php', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      if (response.data.status === 'success') {
        setTimeout(() => {
          setApprovalMessage(true);
      }, 300);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
  }
  };

  
  return (
    <div className="bg-blue-700 min-h-screen flex flex-col items-center justify-center">

      {/* Modal for Loading Spinner */}
      {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                        <ImSpinner2 className="animate-spin w-10 h-10 text-blue-500" />
                    </div>
                </div>
            )}
            
      <div className="relevant form xl:w-2/3 mt-10 justify-between rounded-xl h-4/5 sm:flex max-sm:flex-column max-sm:text-center max-sm:w-full">
      <div className="header relative flex flex-col items-center justify-center space-y-24 w-2/4 h-auto py-4 max-sm:w-full">
          <img src={SideImg} alt="URS Logo" className="w-98 h-98 z-20" />
      </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-3 float:right h-auto max-w-lg p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 sm:max-w-full sm:p-5">
            <p className="text-3xl font-semibold tracking-tight relative flex items-center pl-7 text-cyan-500 sm:text-2xl">
            Register (Students)
              <span className="absolute left-0 h-4 w-4 rounded-full bg-cyan-500 animate-pulse"></span>
            </p>
            <p className="text-base text-gray-400 sm:text-sm">Signup now and get Parking Slot.</p>
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
            <label className="relative w-full">
              <input name="studentNumber" value={formData.studentNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Student Number</span>
            </label>
            <label className="relative w-full">
              <input name="fullname" value={formData.fullname} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
              <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">FullName</span>
            </label>
          </div>
          <label className="relative">
            <input name="email" value={formData.email} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="email" placeholder=" " required />
            <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Email</span>
          </label>
          <label className="relative">
            <input name="yearsection" value={formData.yearsection} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
            <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Year & Section</span>
          </label>
          <label className="relative">
            <select name="course" value={formData.course} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required >
            <option value="" disabled selected hidden>Course</option>
            <option>BS Civil Engineering</option>
            <option>BS Computer Engineering</option>
            <option>BS Electrical Engineering</option>
            <option>BS Electronics Engineering</option>
            <option>BS Mechanical Engineering</option>
            <option>BS Hospitality Management</option>
            <option>BS Biology - Microbiology</option>
            <option>BS Mathematics</option>
            <option>BS Psychology</option>
            <option>BS Computer Science</option>
            <option>Bachelor in Human Services</option>
            <option>BE Education</option>
            <option>BSE - Science</option>
            <option>BSE - English</option>
            <option>BSE - Mathematics</option>
            <option>BSE - Home Economics</option>
            <option>BSE - Industrial Arts</option>
            <option>BSE - Information and Communication Technology</option>
            <option>BTVTE - Drafting Technology</option>
            <option>BIT - Automotive Technology</option>
            <option>BIT - Architectural Drafting Technology</option>
            <option>BIT - Construction Technology</option>
            <option>BIT - Electrical Technology</option>
            <option>BIT - Electronics Technology</option>
            <option>BIT - Heating, Ventilating and Air-conditioning</option>
            <option>BIT - Mechanical Technology</option>
            </select>
          </label>
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
            <label className="relative w-full">
              <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="placeholder:text-gray-400 w-full bg-gray-800 text-white py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" required>
              <option value="" disabled selected hidden>Type of Vehicle</option>
                <option>Motorcycle</option>
                <option>Tricycle</option>
                <option>Fourwheeler</option>
              </select>
            </label>
            <label className="relative w-full">
              <input name="plateNumber" value={formData.plateNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Plate Number</span>
            </label>
          </div>
          <label className="relative">
            <input name="password" value={formData.password} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type={showPassword ? 'text' : 'password'} placeholder=" " required />
            <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
            <button
            onClick={togglePassword}
            className="absolute right-5 top-5">
              {showPassword ? <IoEyeOff className="w-6 h-6"/> : <IoEye className="w-6 h-6"/>}
            </button>
          </label>
          <p className="mt-2 text-gray-400">Upload the file requirements as an image only.<span className="text-red-500">*</span></p>
          <div class="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
            <div class="w-full lg:w-1/3">
              <label for="formFileLicense" class="form-label block text-sm font-medium text-gray-700">License</label>
              <input name="license" class="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" type="file" id="formFileLicense" onChange={handleFileChange}/>
            </div>
            <div class="w-full lg:w-1/3">
              <label for="formFileOrcr" class="form-label block text-sm font-medium text-gray-700">ORCR</label>
              <input name="orcr" class="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" type="file" id="formFileOrcr" onChange={handleFileChange}/>
            </div>

            <div class="w-full lg:w-1/3">
              <label for="formFileCor" class="form-label block text-sm font-medium text-gray-700">COR</label>
              <input name="cor" class="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" type="file" id="formFileCor" onChange={handleFileChange}/>
            </div>
          </div>
          <button type="submit" className="border-none outline-none py-3 rounded-md text-white text-lg transform transition duration-300 ease bg-cyan-500 hover:bg-cyan-400 sm:py-2.5" disabled={isLoading}>
            Submit
          </button>
          <p className="text-center text-base text-gray-400 sm:text-sm">
            Already have an account? 
            <Link to="/studentlogin" className="text-cyan-500 hover:underline ml-1">Login</Link>
          </p>
        </form>
      </div>
      {approvalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white flex flex-col items-center p-6 rounded shadow-md">
            <h2 className="text-xl text-center font-bold">Notice <span className="text-red-600">*</span></h2>
                <p>Registration Successful! Please wait for the admin approval.</p>
                <button 
                    onClick={() => {
                        setApprovalMessage(false); // Clear the message
                        navigate('/studentlogin'); // Redirect to the login page
                    }} 
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                    Okay
                </button>
            </div>
        </div>
      )}
      {message && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white max-w-96 p-6 flex flex-col justify-center rounded shadow-md">
                <h2 className="text-xl text-center font-bold">Notice <span className="text-red-600">*</span></h2>
                <p>{message}</p>
                <button 
                    onClick={() => {
                        setMessage(false);
                    }} 
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                    Okay
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
