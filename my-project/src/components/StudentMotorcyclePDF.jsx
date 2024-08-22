import { React, useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autoTable plugin
import URS from '../Pictures/urs.png';

export default function StudentMotorcyclePDF() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/website/my-project/Backend/fetchstudentsdata.php', { withCredentials: true })
      .then(response => {
        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log('Error fetching student data:', error);
      });
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Students Data', 10, 10);

    // Define the columns and rows for the table
    const tableColumn = ["#", "Name", "Email", "Vehicle,", "Plate Number",];
    const tableRows = [];

    // Loop through students and push the data into rows
    students.forEach((student, index) => {
      const studentData = [
        index + 1,
        student.Name,
        student.Email,
        student.Vehicle,
        student['Plate Number'],
 // Adjust the property names according to your data structure
      ];
      tableRows.push(studentData);
    });

    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Starting position of the table
      theme: 'grid', // Optional: Use 'grid' for grid lines or 'striped' for alternating row colors
      headStyles: { fillColor: [0, 0, 102] }, // Optional: Customize header style
      styles: { fontSize: 10 }, // Optional: Adjust font size
    });

    // Save the PDF
    doc.save('Student-Motorcycle.pdf');
  };

  return (
    <>
      <div className="w-40 h-40 bg-white">
        <button onClick={generatePDF}>Generate PDF</button>
      </div>
    </>
  );
}
