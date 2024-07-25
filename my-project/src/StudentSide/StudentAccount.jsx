/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsExclamationTriangle } from "react-icons/bs";
import { BsCreditCard2Front } from "react-icons/bs";
import { BsTaxiFront } from "react-icons/bs";
import { BsExclamationDiamond } from "react-icons/bs";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

export default function StudentAccount() {
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [licenseSrc, setLicenseSrc] = useState('');
  const [orcrSrc, setOrcrSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullname: '',
    email: '',
    yearsection: '',
    course: '',
    password: '',
    license: null,
    orcr: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost/website/my-project/Backend/edituser.php', form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Update user data state
        setUserData((prev) => ({
          ...prev,
          ...formData,
          password: '', // Don't show the password in user data
        }));
        alert('Account updated successfully');
      } else {
        alert('Error updating account: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Error updating account. Please try again.');
    }
  };

  const handleOpenModal = (src) => {
    setModalImageSrc(src);
    setIsModalOpen(true);
  };

  const handleCloseModal =() => {
    setIsModalOpen(false);
    setModalImageSrc('');
  };

  useEffect(() => {
    axios.get('http://localhost/website/my-project/Backend/fetchdata.php', { withCredentials: true })
      .then(response => {
        console.log('Fetched user data:', response.data); // Log the response
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log('Error fetching user data:', error);
      });
  }, []);
  

  useEffect(() => {
    const fetchImage = async (type) => {
      try {
        const response = await axios.get(`http://localhost/website/my-project/Backend/fetchimage.php?type=${type}`, {
          responseType: 'blob',
          withCredentials: true
        });
        const imageUrl = URL.createObjectURL(response.data);
        if (type === 'License') {
          setLicenseSrc(imageUrl);
        } else if (type === 'ORCR') {
          setOrcrSrc(imageUrl);
        }
      } catch (error) {
        console.error(`Error fetching ${type} image:`, error);
      }
    };

    fetchImage('License');
    fetchImage('ORCR');
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const response = await axios.get('http://localhost/website/my-project/Backend/logout.php', {
        withCredentials: true,
      });

      console.log('Logout response:', response.data);

      if (response.data.success) {
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('Error logging out: ' + error.message);
      console.error('Error logging out: ', error);
    }
  };

  const handleEditChange = async (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value});
  };

  return (
    <>
      <div className="relative w-full lg:h-screen bg-blue-900 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full fixed top-4 left-4 z-10"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Navigation menu */}
        <nav className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-md:flex max-md:flex-col max-md:items-center md:flex md:flex-col md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
          <div className="bg-blue-900 w-3/4 h-24 text-white flex flex-col items-center justify-center mt-10 rounded-xl text-xl tracking-wider">
            <h1 className="text-bold text-white text-xl tracking-widest">{userData.Name}</h1>
            <p className="text-xs">{userData['Student Number']}</p>
          </div>
          <ul className="flex flex-col justify-evenly p-5 w-full h-2/4 relative">
            <Link to="/studentdashboard" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/studentparkingslot" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <a className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200" href="#">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full">
              <BsExclamationDiamond /> <span className="ml-5">Report</span>
              </li>
            </a>
            <Link to="/studentaccount" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200 bg-blue-900">
              <li className="group-hover:text-white text-2xl text-white tracking-widest flex items-center w-full">
              <BsFillPersonVcardFill /> <span className="ml-5">Account</span>
              </li>
            </Link>
          </ul>
          <button className="w-3/4 h-14 rounded-xl text-red-600 border border-red-500 font-semibold tracking-widest text-2xl bg-white flex items-center justify-center hover:bg-red-600" onClick={handleLogout}>
            <span className="hover:text-white hover:bg-red-600 rounded-xl flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut />Logout</span>
          </button>
        </nav>

        <div className="w-full">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">{isNavOpen ? '' : 'Account'}</p>
          </div>
          <div className="w-11/12 h-4/5 p-2 bg-white mt-16 lg:ml-16 rounded-xl max-sm:w-full ">
            <h1 className="">
              You can edit your Account!
            </h1>
            <div className="h-9/10 bg-gray-300 rounded-xl overflow-auto">
              <ul className="h-2/5 w-full flex flex-col justify-between">
                <li className="mb-2 mt-3"><b>Student Number:</b> {userData['Student Number']}</li>
                <li className="mb-2"><b>Name:</b> {userData.Name}</li>
                <li className="mb-2"><b>Email:</b> {userData.Email}</li>
                <li className="mb-2"><b>Year and Section:</b> {userData['Year and Section']}</li>
                <li className="mb-2"><b>Course:</b> {userData.Course}</li>
                <li className="mb-2 max-sm:overflow-scroll flex items-center"><b>Password: </b> {userData.Password}</li>
                <li className="mb-2"><b>Vehicle:</b> {userData.Vehicle}</li>
                <li><b>Plate Number:</b> {userData['Plate Number']}</li>
                <div className="mt-10">
                <li>
                    <b>License:</b><br />
                    {licenseSrc ? (
                      <>
                        <img src={licenseSrc} alt="License" className="w-32 h-auto inline-block" />
                        <button onClick={() => handleOpenModal(licenseSrc)} className="ml-2 text-blue-500 hover:text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.94 4.94m0 0L15 20.87m4.94-5.94H3.75M9.75 10h3m-3 4h3" />
                          </svg>
                        </button>
                      </>
                    ) : 'No image available'}
                  </li>
                  <li className="mt-4">
                    <b>ORCR:</b><br />
                    {orcrSrc ? (
                      <>
                        <img src={orcrSrc} alt="ORCR" className="w-32 h-auto inline-block" />
                        <button onClick={() => handleOpenModal(orcrSrc)} className="ml-2 text-blue-500 hover:text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.94 4.94m0 0L15 20.87m4.94-5.94H3.75M9.75 10h3m-3 4h3" />
                          </svg>
                        </button>
                      </>
                    ) : 'No image available'}
                  </li>

                  {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="relative bg-white p-4 rounded-lg shadow-lg flex justify-center w-3/4 h-3/4 max-sm:h-1/3 max-sm:w-full">
                        <button onClick={handleCloseModal} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <img src={modalImageSrc} alt="Enlarged" className="max-w-full max-h-full max-sm:w-full" />
                      </div>
                    </div>
                  )}

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 mb-3">
                  Edit Account
                </button>

                  {isEditModalOpen ? (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                      <div className="bg-white p-8 rounded-lg">
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-3 float:right h-auto max-w-lg p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 sm:max-w-full sm:p-5">
                            <p className="text-3xl font-semibold tracking-tight relative flex items-center pl-7 text-cyan-500 sm:text-2xl">
                            Edit Account (Students)
                              <span className="absolute left-0 h-4 w-4 rounded-full bg-cyan-500 animate-pulse"></span>
                            </p>
                          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
                            <label className="relative w-full">
                              <input name="studentNumber" value={formData.studentNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5 cursor-no-drop" type="text" placeholder={userData[`Student Number`]} required disabled/> <BsExclamationTriangle class="absolute left-16 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
                            <option>Bachelor of Elementary Education</option>
                            <option>Bachelor of Secondary Education - Science</option>
                            <option>Bachelor of Secondary Education - English</option>
                            <option>Bachelor of Secondary Education - Mathematics</option>
                            <option>Bachelor of Livelihood Education - Home Economics</option>
                            <option>Bachelor of Livelihood Education - Industrial Arts</option>
                            <option>Bachelor of Livelihood Education - Information and Communication Technology</option>
                            <option>Bachelor of Technical Vocational Teacher Education - Drafting Technology</option>
                            <option>Bachelor of Industrial Technology - Automotive Technology</option>
                            <option>Bachelor of Industrial Technology - Architectural Drafting Technology</option>
                            <option>Bachelor of Industrial Technology - Construction Technology</option>
                            <option>Bachelor of Industrial Technology - Electrical Technology</option>
                            <option>Bachelor of Industrial Technology - Electronics Technology</option>
                            <option>Bachelor of Industrial Technology - Heating, Ventilating and Air-conditioning</option>
                          <option>Bachelor of Industrial Technology - Mechanical Technology</option>
                            </select>
                          </label>
                          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
                          </div>
                          <label className="relative">
                            <input name="password" value={formData.password} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="password" placeholder=" " required />
                            <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
                          </label>
                          <div>
                            <label for="formFile" class="form-label">License</label>
                            <input name="license" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
                          </div>
                          <div>
                            <label for="formFile" class="form-label">ORCR</label>
                            <input name="orcr" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setIsEditModalOpen(false)}
                              className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : ''}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
