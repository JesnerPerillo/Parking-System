/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StudentAccount() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [licenseSrc, setLicenseSrc] = useState('');
  const [orcrSrc, setOrcrSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

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

  return (
    <>
      <div className="relative w-full h-screen bg-blue-900 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full fixed top-4 left-4 z-50"
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
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                Dashboard
              </li>
            </Link>
            <Link to="/studentparkingslot" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                Parking Slots
              </li>
            </Link>
            <a className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200" href="#">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest">
                Report
              </li>
            </a>
            <Link to="/studentaccount" className="group no-underline h-14 flex items-center rounded-xl pl-3 hover:bg-blue-900 mb-2 duration-200 bg-blue-900">
              <li className="group-hover:text-white text-2xl text-white tracking-widest">
                Account
              </li>
            </Link>
          </ul>
          <button className="w-3/4 h-14 rounded-xl text-white font-semibold tracking-widest text-2xl bg-red-600" onClick={handleLogout}>
            Logout
          </button>
        </nav>

        <div className="w-full">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Account</p>
          </div>
          <div className="w-11/12 h-auto p-10 bg-white mt-16 ml-16 rounded-xl">
            <h1 className="">
              You can edit your Account!
            </h1>
            <div className="h-full mt-14">
              <ul className="h-2/5 w-full flex flex-col justify-between">
                <li className="mb-2"><b>Student Number:</b> {userData['Student Number']}</li>
                <li className="mb-2"><b>Name:</b> {userData.Name}</li>
                <li className="mb-2"><b>Email:</b> {userData.Email}</li>
                <li className="mb-2"><b>Year and Section:</b> {userData['Year and Section']}</li>
                <li className="mb-2"><b>Course:</b> {userData.Course}</li>
                <li className="mb-2"><b>Password:</b> {userData.Password}</li>
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
                      <div className="relative bg-white p-4 rounded-lg shadow-lg">
                        <button onClick={handleCloseModal} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <img src={modalImageSrc} alt="Enlarged" className="max-w-full max-h-screen" />
                      </div>
                    </div>
                  )}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
