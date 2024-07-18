import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = () => {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    
    const onScanSuccess = (decodedText, decodedResult) => {
      console.log(`Code scanned = ${decodedText}`, decodedResult);
      
      fetch('reset_time.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          studentNumber: decodedText
        })
      })
      .then(response => response.text())
      .then(data => {
        alert(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };

    html5QrCode.start(
      { facingMode: "environment" }, 
      { fps: 10, qrbox: 250 },
      onScanSuccess
    ).catch(err => {
      console.error(err);
    });

    return () => {
      html5QrCode.stop().then(ignore => {
        // QR Code scanning is stopped.
      }).catch(err => {
        console.error(err);
      });
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div id="reader" className="w-full max-w-md"></div>
    </div>
  );
};

export default QrScanner;