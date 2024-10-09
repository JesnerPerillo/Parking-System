/* eslint-disable jsx-a11y/img-redundant-alt */
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
import { BsEyeFill } from "react-icons/bs";
import { BsPersonFillGear } from "react-icons/bs";
import { BsQuestionSquare } from "react-icons/bs";
import AboutUS from '../Pictures/aboutimg.png';
import GSOLogo from '../Pictures/gsoo.png';
import URSLogo from '../Pictures/urs.png';
import AboutPark from '../Pictures/aboutparking.jpg';
import JesnerImg from '../Pictures/jesner.png';
import JomImg from '../Pictures/jom.png';
import JesterImg from '../Pictures/jester.png';
import VanImg from '../Pictures/van.png';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';


export default function StudentAbout() {
  const [userData, setUserData] = useState({});
  const [adminEmail, setAdminEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [ref2, inView2] = useInView({ triggerOnce: true });
  const [ref3, inView3] = useInView({ triggerOnce: true });
  const [ref4, inView4] = useInView({ triggerOnce: true });

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/logout.php', {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await fetch('https://skyblue-clam-769210.hostingersite.com/fetchdata.php', {
              method: 'GET',
              credentials: 'include', // Include cookies in the request
          });
  
          const data = await response.json();
  
          if (data.success) {
              console.log('User Data:', data.data);
              // Handle user data (e.g., save to state)
          } else {
              console.log('Error fetching user data:', data.message);
              navigate('/');
          }
      } catch (error) {
          console.error('Error:', error);
          navigate('/');
      }
  };
  

    fetchData();
}, []);

  return (
    <>
      <div className="w-full h-screen bg-blue-700 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-700 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-50"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

          {/* Navigation menu */}
          <nav className={`bg-white z-40 rounded-r-2xl drop-shadow-2xl absolute inset-y-0 left-0 transform xl:w-1/5 lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
            <div className=" w-full h-44 text-blue-700 flex flex-col items-center justify-between text-xl tracking-wider">
                <img src={URSLogo} className="w-20 h-26" />
                <h1 className="text-2xl tracking-widest lg:text-sm xl:text-2xl">PARKING SYSTEM</h1>
              </div>
            <div className="flex w-full flex-col justify-evenly h-2/4 relative">
            <Link to="/studentdashboard" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/studentparkingslot" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-base xl:text-lg ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/studentaccount" className="group no-underline w-full h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-lg xl:text-lg ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/studentabout" className="group no-underline h-14 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-lg text-white tracking-widest flex items-center w-full lg:text-xl xl:text-lg ml-5">
              <BsQuestionSquare /> <span className="ml-5">About</span>
              </li>
            </Link>
          </div>
          <button className="w-full h-14 text-red-600 font-semibold tracking-widest text-lg flex items-center justify-center" onClick={() => setLogoutMessage(true)}>
            <span className="hover:text-white hover:bg-red-600 flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180 mr-2"/>Logout</span>
          </button>
          </nav>

        {/*Main Content */}
        <div className="w-full h-screen bg-blue-700">
      <div className="w-full h-20 flex justify-end items-end border-b-2">
        <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">About</p>
      </div>

      <motion.div
        className="w-full h-[calc(100vh-5rem)] overflow-auto bg-blue-700 p-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div ref={ref1} animate={inView1 ? "visible" : "hidden"} variants={fadeIn}>
          <div className="flex flex-col md:flex-row w-full h-auto justify-around mb-10">
            <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
              <motion.img
                src={AboutUS}
                alt="About Us Logo"
                className="max-w-full h-auto"
                initial={{ opacity: 0, x: -100 }}
                animate={inView1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-evenly text-white text-center md:text-left">
              <motion.h1 className="text-3xl md:text-4xl mb-4">About Us</motion.h1>
                <p className="text-justify">We are the IV-E1 BSCS students who developed this system as part of our thesis project. This work was guided under the leadership of our Thesis Adviser, Sir Fernan Natividad, along with the support of our esteemed panelists. The title of our thesis is: "URSM ParkSpot: Enhancing Parking Accessibility for Registered Campus Members."
                The primary objective of this study is to develop a web-based system to enhance the existing manual process of parking accessibility at the University of Rizal System Morong Campus. The system, "URSM ParkSpot: Enhancing Parking Accessibility for Registered Campus Members," is designed to assist the General Services Office (GSO), faculty, and students by reducing paperwork, streamlining the application process for parking spots, and improving overall efficiency.</p>
            </div>
          </div>
        </motion.div>

        {/* Add more sections with the same pattern */}
        <motion.div ref={ref2} animate={inView2 ? "visible" : "hidden"} variants={fadeIn}>
        <div className="flex flex-col-reverse md:flex-row w-full h-auto justify-around mb-10">
            <div className="w-full md:w-1/2 flex flex-col justify-evenly text-white text-center md:text-left">
              <motion.h1 className="text-3xl md:text-4xl mb-4">University of Rizal System</motion.h1>
              <p className="text-justify mt-3">The University of Rizal System (URS) was established as a state university in Rizal Province through the integration of the Rizal State College, Rizal Polytechnic College, and the Rizal Technological University extension campus. Officially formed on August 11, 2001, URS was designated as a state university by Republic Act 9157, with the Tanay Campus identified as the main campus. The university traces its roots back to 1944, when the Rizal Polytechnic College was originally established as Morong High School.

              Today, URS operates ten campuses across Rizal Province, offering a comprehensive range of educational programs from Kindergarten to Graduate School. The university provides academic programs at various levels, including doctorate, master’s, baccalaureate, non-degree, and short-term courses. URS is also active in research, extension, and production services, addressing the educational needs of its stakeholders within and beyond the province.</p>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
              <motion.img
                src={URSLogo}
                alt="URS Logo"
                className="max-w-full h-auto"
                initial={{ opacity: 0, x: -100 }}
                animate={inView1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>
        <div className="flex flex-col md:flex-row w-full h-auto justify-around mb-10">
            <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
              <motion.img
                src={GSOLogo}
                alt="GSO Logo"
                className="max-w-full h-auto"
                initial={{ opacity: 0, x: -100 }}
                animate={inView1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-evenly text-white text-center md:text-left">
              <motion.h1 className="text-3xl md:text-4xl mb-4">General Services Office</motion.h1>
              <p className="text-justify">The General Services Office (GSO) of the University of Rizal System Morong Campus is committed to maintaining a safe, clean, and well-functioning campus environment. Our mission is to provide high-quality services that support the university's academic and administrative needs, ensuring efficient campus maintenance, security, transportation, custodial services, and event management. We strive for excellence through sustainable practices and continuous improvement. Our vision is to be a model of excellence in campus services, known for our commitment to sustainability, and innovation.</p>
            </div>
          </div>
        <motion.div ref={ref3} animate={inView3 ? "visible" : "hidden"} variants={fadeIn}>
          <div className="flex flex-col-reverse md:flex-row w-full h-auto justify-around mb-10">
            <div className="w-full md:w-1/2 flex flex-col justify-evenly text-white text-center md:text-left">
              <motion.h1 className="text-3xl md:text-4xl mb-4">URSM ParkSpot</motion.h1>
              <p className="text-justify p-2">The primary objective of this study is to develop a web-based system to enhance the existing manual process of parking accessibility at the University of Rizal System Morong Campus. The system, "URSM ParkSpot: Enhancing Parking Accessibility for Registered Campus Members," is designed to assist the General Services Office (GSO), faculty, and students by reducing paperwork, streamlining the application process for parking spots, and improving overall efficiency.
                The study will be conducted at the General Services Office (GSO) of the University of Rizal System Morong Campus during the first semester of S.Y. 2024-2025. The respondents will include students, staff, and faculty of the campus.
                </p>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
              <motion.img
                src={AboutPark}
                alt="URS Logo"
                className="max-w-full h-auto"
                initial={{ opacity: 0, x: -100 }}
                animate={inView1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          ref={ref3} 
          initial="hidden" 
          animate={inView3 ? "visible" : "hidden"} 
          variants={fadeIn}
        >
          <div className="w-full h-4/5 w-auto flex flex-col items-center justify-evenly mt-10">
            <div className="text-white text-center p-3 text-3xl border-b-2 full md:text-5xl mb-6">Meet Our Team</div>
            <div className="flex flex-col w-auto justify-center gap-6 sm:flex-row">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: inView3 ? 1 : 0, scale: inView3 ? 1 : 0.8 }}
                transition={{ duration: 0.6 }}
                className="w-68 bg-white rounded p-4 flex flex-col items-center text-blue-900 text-xl"
              >
                <img src={JesnerImg} alt="Jesner Image" className="w-40 h-40 rounded-full mb-2" />
                <p>Jesner Arlan D. Perillo</p>
                <p>Developer</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: inView3 ? 1 : 0, scale: inView3 ? 1 : 0.8 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-68 bg-white rounded p-4 flex flex-col items-center text-blue-900 text-xl"
              >
                <img src={JesterImg} alt="Jester Image" className="w-40 h-40 rounded-full mb-2" />
                <p>Jester T. Bacsain</p>
                <p>Documents</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: inView3 ? 1 : 0, scale: inView3 ? 1 : 0.8 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-68 bg-white rounded p-4 flex flex-col items-center text-blue-900 text-xl"
              >
                <img src={JomImg} alt="Jom Image" className="w-40 h-40 rounded-full mb-2" />
                <p>Jomarie M. Dumasapal</p>
                <p>Designer</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: inView3 ? 1 : 0, scale: inView3 ? 1 : 0.8 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-68 bg-white rounded p-4 flex flex-col items-center text-blue-900 text-xl"
              >
                <img src={VanImg} alt="Van Image" className="w-40 h-40 rounded-full mb-2" />
                <p>Van Carell H. Roldan</p>
                <p>Documents</p>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>

        {logoutMessage && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center rounded-lg shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setLogoutMessage(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  )
}
