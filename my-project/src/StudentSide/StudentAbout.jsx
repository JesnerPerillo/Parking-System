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

export default function StudentAbout() {
  const [userData, setUserData] = useState({});
  const [adminEmail, setAdminEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user data
    axios.get('https://seagreen-wallaby-986472.hostingersite.com/fetchdata.php', { withCredentials: true })
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

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/logout.php', {
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
      <div className="relative w-full lg:h-screen bg-blue-900 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-10"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Navigation menu */}
        <nav className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
          <div className="border-b-2 border-blue-900 w-full h-24 text-blue-900 flex flex-col items-center justify-center mt-10 text-xl tracking-wider">
            <h1 className="text-bold text-3xl sm:text-2xl md:text-4xl lg:text-2xl xl:text-4xl tracking-widest">PARKING SYSTEM</h1>
          </div>
          <div className="flex flex-col justify-evenly w-full h-2/4 relative">
            <Link to="/studentdashboard" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
                <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/studentparkingslot" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-base xl:text-2xl ml-5">
                <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/studentaccount" className="group no-underline w-full h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
                <BsFillPersonVcardFill /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/studentabout" className="group no-underline h-16 flex items-center pl-8 bg-blue-900 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
                <BsQuestionSquare /> <span className="ml-5">About</span>
              </li>
            </Link>
          </div>
          <button className="w-3/4 h-14 rounded-xl text-red-600 border border-red-500 font-semibold tracking-widest text-2xl bg-white flex items-center justify-center hover:bg-red-600" onClick={handleLogout}>
            <span className="hover:text-white hover:bg-red-600 rounded-xl flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180"/>Logout</span>
          </button>
        </nav>

        {/*Main Content */}
        <div className="w-full h-screen bg-blue-900">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">About</p>
          </div>
          <div className="w-full h-[calc(100vh-5rem)] overflow-auto bg-blue-900 p-4">
            <div className="flex flex-col md:flex-row w-full h-auto justify-around mb-10">
              <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
                <img src={AboutUS} alt="About Us Logo" className="max-w-full h-auto" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-evenly text-white text-center md:text-left">
                <h1 className="text-3xl md:text-4xl mb-4">About Us</h1>
                <p className="text-justify">We are the IV-E1 BSCS students who developed this system as part of our thesis project. This work was guided under the leadership of our Thesis Adviser, Sir Fernan Natividad, along with the support of our esteemed panelists. The title of our thesis is: "URSM ParkSpot: Enhancing Parking Accessibility for Registered Campus Members."
                The primary objective of this study is to develop a web-based system to enhance the existing manual process of parking accessibility at the University of Rizal System Morong Campus. The system, "URSM ParkSpot: Enhancing Parking Accessibility for Registered Campus Members," is designed to assist the General Services Office (GSO), faculty, and students by reducing paperwork, streamlining the application process for parking spots, and improving overall efficiency.</p>
              </div>
            </div>
            <div className="flex flex-col-reverse md:flex-row w-full h-auto justify-around mb-10">
              <div className="w-full md:w-1/2 flex flex-col justify-evenly text-justify text-white mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl text-center md:text-left">University of Rizal System</h1>
                <p className="text-justify mt-3">The University of Rizal System (URS) was established as a state university in Rizal Province through the integration of the Rizal State College, Rizal Polytechnic College, and the Rizal Technological University extension campus. Officially formed on August 11, 2001, URS was designated as a state university by Republic Act 9157, with the Tanay Campus identified as the main campus. The university traces its roots back to 1944, when the Rizal Polytechnic College was originally established as Morong High School.

                Today, URS operates ten campuses across Rizal Province, offering a comprehensive range of educational programs from Kindergarten to Graduate School. The university provides academic programs at various levels, including doctorate, master’s, baccalaureate, non-degree, and short-term courses. URS is also active in research, extension, and production services, addressing the educational needs of its stakeholders within and beyond the province.</p>
              </div>
              <div className="w-full md:w-1/2 flex items-center justify-center">
                <img src={URSLogo} alt="URS Logo" className="max-w-full h-auto" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full h-auto justify-around mb-10">
              <div className="w-full md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
                <img src={GSOLogo} alt="GSO Logo" className="max-w-full h-auto" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-evenly text-justify text-white">
                <h1 className="text-3xl md:text-4xl text-center md:text-left">General Services Office</h1>
                <p className="text-justify">The General Services Office (GSO) of the University of Rizal System Morong Campus is committed to maintaining a safe, clean, and well-functioning campus environment. Our mission is to provide high-quality services that support the university's academic and administrative needs, ensuring efficient campus maintenance, security, transportation, custodial services, and event management. We strive for excellence through sustainable practices and continuous improvement. Our vision is to be a model of excellence in campus services, known for our commitment to sustainability, and innovation.</p>
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row w-full h-auto justify-around mb-10">
              <div className="w-full md:w-1/2 flex flex-col justify-evenly text-justify text-white mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl text-center md:text-left">URSM ParkSpot</h1>
                <p className="text-justify p-2">The primary objective of this study is to develop a web-based system to enhance the existing manual process of parking accessibility at the University of Rizal System Morong Campus. The system, "URSM ParkSpot: Enhancing Parking Accessibility for Registered Campus Members," is designed to assist the General Services Office (GSO), faculty, and students by reducing paperwork, streamlining the application process for parking spots, and improving overall efficiency.
                The study will be conducted at the General Services Office (GSO) of the University of Rizal System Morong Campus during the first semester of S.Y. 2024-2025. The respondents will include students, staff, and faculty of the campus.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex items-center justify-center">
                <img src={AboutPark} alt="About Park Img" className="rounded max-w-full h-auto" />
              </div>
            </div>
            <div className="w-full h-4/5 w-auto flex flex-col items-center justify-evenly mt-10">
              <div className="text-white text-center p-3 text-3xl border-b-2 full md:text-5xl mb-6">Meet Our Team</div>
              <div className="flex flex-col w-auto justify-center gap-6 sm:flex-row">
                <div className="w-68 bg-white rounded p-4 flex flex-col items-center text-blue-900 text-xl">
                  <img src={JesnerImg} alt="Jesner Image" className="w-40 h-40 rounded-full mb-2"/>
                  <p>Jesner Arlan D. Perillo</p>
                  <p>Developer</p>
                </div>
                <div className="w-68 bg-white rounded p-4 flex flex-col items-center text-blue-900 text-xl">
                  <img src={JesterImg} alt="Jester Image" className="w-40 h-40 rounded-full mb-2"/>
                  <p>Jester T. Bacsain</p>
                  <p>Documents</p>
                </div>
                <div className="w-68 bg-white rounded p-4 flex flex-col items-center text-blue-900 text-xl">
                  <img src={JomImg} alt="Jom Image" className="w-40 h-40 rounded-full mb-2"/>
                  <p>Jomarie M. Dumasapal</p>
                  <p>Designer</p>
                </div>
                <div className="w-68 bg-white rounded p-4 flex flex-col items-center text-blue-900 text-xl">
                  <img src={VanImg} alt="Van Image" className="w-40 h-40 rounded-full mb-2"/>
                  <p>Van Carell H. Roldan</p>
                  <p>Documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
