import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import GSOLogo from './Pictures/gsoo.png';

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
    <div className="bg-gradient-to-r from-blue-700 to-teal-700 min-h-screen flex flex-col items-center">
      <header className="text-center py-4">
        <p className="text-white text-4xl sm:text-5xl md:text-6xl">UNIVERSITY OF RIZAL SYSTEM</p>
        <span className="text-white text-2xl sm:text-3xl md:text-4xl">MORONG CAMPUS</span>
      </header>
      <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400 text-center text-6xl md:text-7xl tracking-widest"><ColoredLine color="white" />
      PARKING SYSTEM
      <ColoredLine color="white" />
      </h1>
      <div className="flex flex-wrap justify-center py-8 px-4 w-full h-full">
        <div className="text-center flex flex-col justify-center m-4 min-w-full md:min-w-[700px]">
          <img src={GSOLogo} alt="GSO LOGO" className="mx-auto w-full max-w-xs" />
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl mt-4">GENERAL SERVICES OFFICE</h1>
        </div>
        <div className="bg-gray-200 p-6 h-auto rounded-lg m-4 w-full md:w-[450px] flex flex-col justify-center mt-8 md:mt-24">
          <div className="mb-4">
            <p className="text-lg">Log in as :</p>
          </div>
          <div>
            <Link to="/studentsignup" className="block mb-4 p-4 bg-blue-900 text-center text-xl rounded-md hover:bg-blue-700 no-underline text-white font-semibold tracking-widest">
              <p>STUDENTS</p>
            </Link>
            <Link to="/facultystaffsignup" className="block mb-4 p-4 bg-blue-900 text-center text-xl rounded-md hover:bg-blue-700 no-underline tracking-widest text-white font-semibold">
              <p>FACULTY | STAFF</p>
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
