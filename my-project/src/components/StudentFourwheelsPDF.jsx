import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf } from "react-icons/fa";
import URS from '../Pictures/urs.png';
import GSO from '../Pictures/gsoo.png';


export default function StudentFourwheelsPDF() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [vehicleCounts, setVehicleCounts] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/fetchstudentsdata.php', {
          withCredentials: true,
        });

        console.log('Student data response:' + response.data);

        if (response.data.success) {
          const fourwheelerStudents = response.data.students.filter(student => student.Vehicle === 'Fourwheeler');
          setStudents(fourwheelerStudents);

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
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Set the width and height of the images
    const gsoImgWidth = 20; // Width for GSO image
    const gsoImgHeight = 20; // Height for GSO image
    const ursImgWidth = 15; // Width for URS image (slimmer)
    const ursImgHeight = 20; // Height for URS image (slimmer)
  
    // Function to draw the header
    const drawHeader = () => {
      // Add URS image at the upper left corner
      if (URS) {
        doc.addImage(URS, 'PNG', 10, 10, ursImgWidth, ursImgHeight);
      }
  
      // Add GSO image at the upper right corner
      if (GSO) {
        const gsoX = doc.internal.pageSize.getWidth() - gsoImgWidth - 10; // 10 units padding from the right
        doc.addImage(GSO, 'PNG', gsoX, 10, gsoImgWidth, gsoImgHeight);
      }
  
      const republicY = Math.max(ursImgHeight, gsoImgHeight) - 6; // Positioning the title very close to the images
      doc.setFontSize(10); // Larger font for the university title
      doc.text('Republic of the Philippines', doc.internal.pageSize.getWidth() / 2, republicY, { align: 'center' });

      const titleY = Math.max(ursImgHeight, gsoImgHeight); // Positioning the title very close to the images
      doc.setFontSize(20); // Larger font for the university title
      doc.text('University of Rizal System', doc.internal.pageSize.getWidth() / 2, titleY, { align: 'center' });
  
      // Set font size for smaller text
      doc.setFontSize(12); // Smaller font for the campus and report titles
      const campusY = titleY + 6; // Position Morong Campus text closer
      doc.text('Morong Campus', doc.internal.pageSize.getWidth() / 2, campusY, { align: 'center' });
  
      const reportY = campusY + 8; // Position Student Parking Slot Report text closer
      doc.text('Student Parking Slot Report', doc.internal.pageSize.getWidth() / 2, reportY, { align: 'center' });
  
      // Draw a horizontal line below the Student Parking Slot Report
      const lineY = reportY + 4; // Position for the line
      doc.line(10, lineY, doc.internal.pageSize.getWidth() - 10, lineY); // Draw line from left to right
  
      return lineY; // Return the Y position for the table
    };
  
    // Track the starting Y position for the table
    let startY = drawHeader(); // Call the drawHeader function and set the initial startY
  
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
        student.slot_number,
      ];
      tableRows.push(studentData);
  
      // Check if the current position is close to the bottom of the page
      if (doc.autoTable.previous.finalY + 10 >= doc.internal.pageSize.getHeight()) {
        doc.addPage(); // Add a new page
        startY = drawHeader(); // Redraw the header on the new page
      }
    });
  
    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: startY + 10, // Start position of the table below the line
      theme: 'grid', // Optional: Use 'grid' for grid lines or 'striped' for alternating row colors
      headStyles: { fillColor: [0, 0, 102] }, // Header style
      styles: { fontSize: 10 }, // Optional: Adjust font size
    });
  
    // Create a Blob from the PDF and generate a URL
    const pdfOutput = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfOutput);
  
    // Open the PDF in a new tab
    window.open(pdfUrl, '_blank');
  };


  return(
    <>  
      <div className="relative w-full h-full flex flex-col items-center">
        <span className="text-4xl mt-10">{vehicleCounts['Fourwheeler'] || 0}/40</span>
        <button className="w-full flex justify-center items-center h-1/4 bg-red-600 rounded text-white absolute bottom-0 mb-1" onClick={generatePDF}>Download File <FaFilePdf /></button>
      </div>
    </>
  );
}