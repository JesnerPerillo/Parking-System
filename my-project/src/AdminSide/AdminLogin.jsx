import React from 'react';
import URSlogo from '.././Pictures/urs.png';
import GSOlogo from '.././Pictures/gsoo.png';
import '.././App.css'
import AdminLogo from '../components/admin.png'

export default function StudentLogin() {
  return (
    <div className="bg-gradient-to-r from-blue-700 w-full to-teal-700 min-h-screen flex flex-col items-center">
      <div className="form xl:w-2/4 mt-28 justify-between rounded-xl h-4/5 sm:flex max-sm:flex-column max-sm:text-center max-sm:w-full bg-blue-900">
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
      <form className="flex flex-col gap-4 float:right w-2/4 p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 max-sm:w-full sm:p-5">
      <p className="text-3xl font-semibold tracking-tight relative flex items-center pl-7 text-cyan-500 sm:text-2xl">
        Login (Admin)
        <span className="absolute left-0 h-4 w-4 rounded-full bg-cyan-500 animate-pulse"></span>
      </p>
      <div className="w-full h-full p-0 m-0 flex align-center justify-center mt-4 max-md:scale-75 max-sm:scale-75">
      <img src={AdminLogo}  className="w-36 h-36 scale-150" />
      </div>
      <p className="text-base text-gray-400 sm:text-sm">Login your Account.</p>
      <label className="relative">
        <input name="email" className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="email" placeholder=" " required />
        <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Full Name</span>
      </label>
      <label className="relative">
        <input className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="password" placeholder=" " required />
        <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
      </label>
      <button className="border-none outline-none py-3 rounded-md text-white text-lg transform transition duration-300 ease bg-cyan-500 hover:bg-cyan-400 sm:py-2.5 mb-10">
        Submit
      </button>
    </form>
      </div>
    </div>
  );
}
