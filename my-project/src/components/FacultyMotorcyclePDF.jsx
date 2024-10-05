import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import URS from '../Pictures/urs.png';
import GSO from '../Pictures/gsoo.png';
import { FaFilePdf } from "react-icons/fa";

export default function FacultyMotorcyclePDF() {
  const [faculty, setFaculty] = useState([]);
  const [error, setError] = useState('');
  const [vehicleCounts, setVehicleCounts] = useState([]);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/fetchfacultydata.php', {
          withCredentials: true,
        });

        console.log('Faculty data response:' + response.data);

        if (response.data.success) {
          // Filter for motorcycle faculty
          const motorcycleFaculty = response.data.faculty.filter(faculty => faculty.Vehicle === 'Motorcycle');
          setFaculty(motorcycleFaculty);

          // Set vehicle counts
          if (response.data.vehicleCounts) {
            const vehicleCounts = {};
            for (const [vehicle, count] of Object.entries(response.data.vehicleCounts)) {
              vehicleCounts[vehicle] = Number(count);
            }
            setVehicleCounts(vehicleCounts);
          } else {
            setVehicleCounts({});
          } 
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching data:'+ error.message);
        console.error('Error fetching faculty data:', error);
      }
    };

    fetchFacultyData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add the logos at the upper left and right corners
    doc.addImage(URS, 'png', 10, 5, 20, 30);
    doc.addImage(GSO, 'png', 170, 5, 30, 30);

    // Calculate position to center the text
    const pageWidth = doc.internal.pageSize.getWidth();
    const text = 'Motorcycle Faculty Data';
    const textWidth = doc.getTextWidth(text);
    const textXPosition = (pageWidth - textWidth) / 2;

    // Add the text centered at the top
    doc.text(text, textXPosition, 20);

    // Set font size and position for the table
    doc.setFontSize(16); // Optional: Adjust font size for the table
    const tableYPosition = 40; // Adjust based on logo height

    // Create the table columns and rows
    const tableColumn = ["#", "Name", "Email", "Position", "Building", "Vehicle", "Plate Number", "Parking Slot"];
    const tableRows = [];

    faculty.forEach((faculty, index) => {
      const facultyData = [
        index + 1,
        faculty.Name,
        faculty.Email,
        faculty.Position,
        faculty.Building,
        faculty.Vehicle,
        faculty['Plate Number'],
        faculty.slot_number,
      ];
      tableRows.push(facultyData);
    });

    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: tableYPosition,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 102] },
      styles: { fontSize: 9 },
    });

    // Save the PDF
    doc.save('Faculty-Motorcycle.pdf');
  };

  return (
    <>  
      <div className="relative w-full h-full flex flex-col items-center">
        <span className="text-4xl mt-10">{vehicleCounts['Motorcycle'] || 0}/110</span>
        <button className="w-full flex justify-center items-center h-1/4 bg-red-600 rounded text-white absolute bottom-0 mb-1" onClick={generatePDF}>
          Download File <FaFilePdf />
        </button>
      </div>
    </>
  );
}
