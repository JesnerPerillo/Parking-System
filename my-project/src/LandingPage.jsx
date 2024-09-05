import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import GSOLogo from './Pictures/gsoo.png';
import URSLogo from './Pictures/urs.png';
import Car from './Pictures/carr.png';

function LandingPage() {
  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 2,
      }}
    />
  );

  return (
    <div className="bg-blue-700 min-h-screen flex flex-col items-center">
      <header className="text-center py-4">
      <div className="relative flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-4 lg:space-x-8 p-4">
        <img src={GSOLogo} alt="GSO LOGO" className="w-24 h-24 sm:w-36 sm:h-36" />
        <p className="text-white text-4xl text-center mt-2 sm:mt-0 sm:text-left sm:text-4xl md:text-5xl lg:text-6xl sm:mx-4">
          UNIVERSITY OF RIZAL SYSTEM
        </p>
        <img src={URSLogo} alt="URS LOGO" className="w-16 h-24 sm:w-24 sm:h-36" />
      </div>
        <span className="text-white text-2xl sm:text-3xl md:text-4xl">MORONG CAMPUS</span>
      </header>
      <h1 className="text-white text-center text-6xl md:text-7xl tracking-widest"><ColoredLine color="white" />
      PARKING SYSTEM
      <ColoredLine color="white" />
      </h1>
      <div className="flex flex-wrap justify-evenly w-full h-3/4">
        <div className="text-center h-1/3 w-2/5 flex flex-col justify-center min-w-full md:min-w-[700px]">
          <img src={Car} alt="GSO LOGO" className="w-full h-full" />
        </div>
        <div className="bg-gray-200 p-6 h-auto rounded-lg mt-5 m-2 w-full md:w-[450px] flex flex-col justify-center mt-8 md:mt-24">
          <div className="mb-4">
            <p className="text-lg">Log in as :</p>
          </div>
          <div>
            <Link to="/studentsignup" className="block mb-4 p-4 bg-blue-900 text-center text-xl rounded-md hover:bg-blue-700 no-underline text-white font-semibold tracking-widest">
              <p>STUDENTS</p>
            </Link>
            <Link to="/facultystaffsignup" className="block mb-4 p-4 bg-blue-900 text-center text-xl rounded-md hover:bg-blue-700 no-underline tracking-widest text-white font-semibold">
              <p>FACULTY|STAFF</p>
            </Link>
            <Link to="/adminlogin" className="block mb-4 p-4 bg-blue-900 text-center text-xl rounded-md hover:bg-blue-700 no-underline tracking-widest text-white font-semibold">
              <p>ADMIN</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
