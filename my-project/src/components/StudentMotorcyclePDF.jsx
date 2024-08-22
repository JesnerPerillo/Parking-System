import {React, useState, useEffect} from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
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

    doc.text('UserData', 10, 10);

    students.forEach((student, index) => {
      doc.text(`${index + 1}. Name: ${student.Name}`, 10, 10 + index * 10);
    });

    doc.save('Student-Motorcycle.pdf');
  }

  return (
    <>
      <div className="w-40 h-40 bg-white">
        <button onClick={generatePDF}>Generate PDF</button>
      </div>
    </>
  );
}