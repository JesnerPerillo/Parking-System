import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autoTable plugin
import { FaFilePdf } from "react-icons/fa";

export default function FacultyTotalUsers() {
  const [faculty, setFaculty] = useState([]);
  const [error, setError] = useState('');
  const [vehicleCounts, setVehicleCounts] = useState({});
  const [totalFaculty, setTotalFaculty] = useState(0); // State for total faculty count

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/fetchfacultydata.php', {
          withCredentials: true,
        });

        console.log('Faculty data response:', response.data); // Log the response data

        if (response.data.success) {
          // Set all faculty data
          setFaculty(response.data.faculty);
          setTotalFaculty(response.data.faculty.length); // Set total faculty count

          // Process vehicle counts
          if (response.data.vehicleCounts) {
            const vehicleCounts = {};
            for (const [vehicle, count] of Object.entries(response.data.vehicleCounts)) {
              vehicleCounts[vehicle] = Number(count);
            }
            setVehicleCounts(vehicleCounts);
          } else {
            setVehicleCounts({}); // Default to an empty object if vehicleCounts is missing
          }
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching faculty data: ' + error.message);
        console.error('Error fetching faculty data: ', error);
      }
    };

    fetchFacultyData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Total Faculty Data', 10, 10);

    // Define the columns and rows for the table
    const tableColumn = ["#", "Name", "Email", "Position", "Building", "Vehicle", "Plate Number", "Parking Slot"];
    const tableRows = [];

    // Loop through faculty and push the data into rows
    faculty.forEach((faculty, index) => {
      const facultyData = [
        index + 1,
        faculty.Name,
        faculty.Email,
        faculty.Position,
        faculty.Building,
        faculty.Vehicle,
        faculty['Plate Number'],
        faculty.slot_number || null,
      ];
      tableRows.push(facultyData);
    });

    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Starting position of the table
      theme: 'grid', // Optional: Use 'grid' for grid lines or 'striped' for alternating row colors
      headStyles: { fillColor: [0, 0, 102] }, // Header style
      styles: { fontSize: 10 }, // Optional: Adjust font size
    });

    // Save the PDF
    doc.save('Total-Faculty-Parking-Data.pdf');
  };

  return (
    <>
      <div className="relative w-full h-full flex flex-col items-center">
        <span className="text-4xl mt-10">{totalFaculty}/135</span>
        <button className="w-full flex justify-center items-center h-1/4 bg-red-600 rounded text-white absolute bottom-0 mb-1" onClick={generatePDF}>Download File <FaFilePdf /></button>
      </div>
    </>
  );
}
