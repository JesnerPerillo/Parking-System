/* eslint-disable no-undef */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import URSlogo from '.././Pictures/urs.png';
import GSOlogo from '.././Pictures/gsoo.png';
import '.././App.css'
import axios from 'axios';

export default function FacultyStaffSignup(){
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    position: '',
    building: '',
    vehicleType: '',
    plateNumber: '',
    password: '',
    license: null,
    orcr: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
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
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

    try {
      const response = await axios.post('http://localhost/website/my-project/Backend/facultystaffsignup.php', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message);

      if (response.data.status === 'success') {
        navigate('/facultystafflogin');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during Registration');
    }
};

  
  return(
    <>
      <div className="bg-gradient-to-r from-blue-700 w-full to-teal-700 min-h-screen flex flex-col items-center">
      <div className="form xl:w-2/3 mt-16 justify-between rounded-xl h-4/5 sm:flex max-sm:flex-column max-sm:text-center max-sm:w-full bg-blue-900">
      <div className="header flex flex-col items-center justify-center space-y-24 w-2/4 h-auto py-4 max-sm:w-full">
        <div className="gso-logo flex items-center justify-center w-full md:w-1/3">
          <img src={GSOlogo} alt="GSOLogo" className="w-24 h-24 md:w-36 md:h-36" />
        </div>
        <div className="gso-title flex items-center justify-center w-full md:w-1/3 text-center md:text-left">
          <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-5xl">
            <span className="text-4xl md:text-6xl tracking-wider">G</span>eneral{' '}
            <span className="text-4xl md:text-6xl tracking-wider">S</span>ervices{' '}
            <span className="text-4xl md:text-6xl tracking-wider">O</span>ffice
          </h1>
        </div>
        <div className="urs-logo flex items-center justify-center w-full md:w-1/3">
          <img src={URSlogo} alt="URS Logo" className="w-20 h-24 md:w-28 md:h-32" />
        </div>
      </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-2/4 gap-3 float:right h-auto max-w-3xl p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 max-sm:w-full sm:p-5">
            <p className="text-3xl font-semibold tracking-tight relative flex items-center pl-7 text-cyan-500 sm:text-2xl">
            Register (Faculty and Staff)
              <span className="absolute left-0 h-4 w-4 rounded-full bg-cyan-500 animate-pulse"></span>
            </p>
            <p className="text-base text-gray-400 sm:text-sm">Signup now and get Parking Slot.</p>
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
            <label className="relative w-full">
              <input name="fullname" value={formData.fullname} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">FullName</span>
            </label>
            <label className="relative w-full">
              <input name="email" value={formData.email}  onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="email" placeholder=" " required />
              <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Email</span>
            </label>
          </div>
          <label className="relative">
            <input name="position" value={formData.position} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
            <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Position</span>
          </label>
          <label className="relative">
            <input name="building" value={formData.building} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
            <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Building</span>
          </label>
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
            <label className="relative w-full">
              <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="placeholder:text-gray-400 w-full bg-gray-800 text-white py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" required>
              <option value="" disabled  hidden>Type of Vehicle</option>
                <option>Motorcycle</option>
                <option>Tricycle</option>
                <option>FourWheels</option>
              </select>
            </label>
            <label className="relative w-full">
              <input name="plateNumber" value={formData.plateNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Plate Number</span>
            </label>
          </div>
          <label className="relative">
            <input name="password" value={formData.password} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="password" placeholder=" " required />
            <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
          </label>
          <div>
            <label for="formFile" class="form-label">License</label>
            <input name="license" onChange={handleFileChange} class="form-control" type="file" id="formFile" />
          </div>
          <div>
            <label for="formFile1" class="form-label">ORCR</label>
            <input name="orcr" onChange={handleFileChange} class="form-control" type="file" id="formFile1" />
          </div>
          <button className="border-none outline-none py-3 rounded-md text-white text-lg transform transition duration-300 ease bg-cyan-500 hover:bg-cyan-400 sm:py-2.5">
            Submit
          </button>
          <p className="text-center text-base text-gray-400 sm:text-sm">
            Already have an account? 
            <Link to="/facultystafflogin" className="text-cyan-500 hover:underline ml-1">Login</Link>
          </p>
        </form>
      </div>
    </div>
    </>
  )
}