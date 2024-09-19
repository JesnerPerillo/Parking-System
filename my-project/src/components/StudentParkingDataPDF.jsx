import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autoTable plugin
import { FaFilePdf } from "react-icons/fa";

export default function StudentMotorcyclePDF() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [vehicleCounts, setVehicleCounts] = useState({});
  const [totalStudents, setTotalStudents] = useState(0); // State for total student count

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/fetchstudentsdata.php', {
          withCredentials: true,
        });

        console.log('Student data response:', response.data); // Log the response data

        if (response.data.success) {
          // Set all student data
          setStudents(response.data.students);
          setTotalStudents(response.data.students.length); // Set total student count

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
        setError('Error fetching student data: ' + error.message);
        console.error('Error fetching student data: ', error);
      }
    };

    fetchStudentData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Total Students Data', 10, 10);

    // Define the columns and rows for the table
    const tableColumn = ["#", "Student Number", "Name", "Email", "Vehicle", "Plate Number", "Parking Slot"];
    const tableRows = [];

    // Loop through students and push the data into rows
    students.forEach((student, index) => {
      const studentData = [
        index + 1,
        student['Student Number'],
        student.Name,
        student.Email,
        student.Vehicle,
        student['Plate Number'],
        student.slot_number || null,
      ];
      tableRows.push(studentData);
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
    doc.save('Total-Student-Parking-Data.pdf');
  };

  return (
    <>
      <div className="relative w-full h-full flex flex-col items-center">
        <span className="text-4xl mt-10">{totalStudents}/580</span>
        <button className="w-full flex justify-center items-center h-1/4 bg-red-600 rounded text-white absolute bottom-0 mb-1" onClick={generatePDF}>Download File <FaFilePdf /></button>
      </div>
    </>
  );
}
