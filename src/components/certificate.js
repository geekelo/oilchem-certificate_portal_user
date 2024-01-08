import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode.react';
import { displayPersonnel } from '../redux/certificateSlice';
import logo from '../assets/cert-logo.png';
import '../stylesheets/certificate.css';
import sidedesign1 from '../assets/cert-side1.png';
import sidedesign2 from '../assets/cert-side2.png';
import ogtanlogo from '../assets/OGTAN-from-web.webp';
import isologo from '../assets/iso-logo.png';

function Certificate({ foundCertificate }) {
  const dispatch = useDispatch();
  const personnel = useSelector((state) => state.display_certificates.personnel);
  const { certificate, student } = foundCertificate;
  const certificateRef = useRef();
  const [imageLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    dispatch(displayPersonnel());
  }, [dispatch]);

  // CERTIFICTE CONVERTER AND DOWNLOADER
  const downloadCertificate = async () => {
    if (!imageLoaded) {
      // Images are not loaded yet. Aborting download.'
      return;
    }

    const certificate = certificateRef.current;

    // Get the HTML content of the certificate
    // const certificateHTML = certificate.outerHTML;

    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({
      orientation: 'landscape',
    });

    // Add the image to the PDF
    // const imgData = canvas.toDataURL('image/png');
    // pdf.addImage(imgData, 'PNG', 0, 0);

    // Add the HTML content to the PDF
    pdf.html(certificate, {
      async callback(pdf) {
        await pdf.save('document');
      },
    });

    // Save the PDF
    // pdf.save('certificate.pdf');
  };

  // DATE FORMATTER
  const formatDate = (inputDate) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const [year, month, day] = inputDate.split('-');
    const monthAbbreviation = months[parseInt(month, 10) - 1];

    return `${parseInt(day, 10)} ${monthAbbreviation}, ${year}`;
  };

  // ENSURE ALL IMAGES ARE LOADED
  useEffect(() => {
    const image1 = new Image();
    image1.src = sidedesign1;

    const image2 = new Image();
    image2.src = sidedesign2;

    const image3 = new Image();
    image3.src = logo;

    Promise.all([
      new Promise((resolve) => {
        image1.onload = resolve;
      }),
      new Promise((resolve) => {
        image2.onload = resolve;
      }),
      new Promise((resolve) => {
        image3.onload = resolve;
      }),
    ]).then(() => {
      // All images loaded successfully.'
      setImagesLoaded(true);
    });
  }, []);

  const styles = {
    certificatecont: {
      display: 'flex',
      paddingRight: '5vh',
      width: '100vh',
      margin: 'auto',
    },

    certName: {
      color: '#0d381e',
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      marginTop: 0,
    },

    studNum: {
      textTransform: 'lowercase',
    },

    certLogo: {
      position: 'relative',
      top: '8%',
      marginTop: '3vh',
      marginBottom: 0,
    },

    sideDesign: {
      position: 'relative',
      left: 0,
      bottom: 0,
      top: 0,
      width: '50vh',
      display: 'block',
    },

    certificate: {
      backgroundColor: '#fff',
      display: 'flex',
      width: '150vh',
      height: '250vh',
      gap: '5px',
    },

    certDataSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '70%',
      margin: 'auto',
    },

    certNameSection: {
      position: 'relative',
      top: '1vh',
      fontSize: '3.3vh',
      textTransform: 'capitalize',
      margin: 0,
    },

    certTitle: {
      fontSize: '2.5vh',
      textTransform: 'uppercase',
      margin: 0,
      fontWeight: 900,
    },

    certAwardedTo: {
      fontSize: '2vh',
      margin: '1vh 0',
      textAlign: 'center',
      textTransform: 'capitalize',
    },

    certPurpose: {
      fontSize: '1.5vh',
      margin: '1vh 0',
      textAlign: 'center',
      textTransform: 'uppercase',
    },

    studName: {
      fontSize: '4vh',
      fontWeight: 600,
      margin: '0.7vh 0',
      display: 'flex',
      borderBottom: '1px dotted #0d381e',
    },

    duration: {
      fontSize: '2vh',
      marginTop: '1vh',
    },

    personnel: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      marginTop: '2vh',
    },

    personnelTitle: {
      borderTop: '1px dotted #0d381e',
      fontWeight: 'bold',
    },

    signature: {
      display: 'block',
      margin: 'auto',
    },

    partnersLogoCont: {
      display: 'flex',
      gap: '1vh',
    },

    qrCodeCont: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
    },

    qrCodeContP: {
      margin: 0,
    },

    footer: {
      display: 'flex',
      gap: '15vh',
      marginTop: '1.5vh',
      justifyContent: 'flex-end',
      fontWeight: 'bold',
    },

    certVerify: {
      fontSize: '0.7rem',
      marginTop: '-0.5vh',
    },

    downloadBtn: {
      backgroundColor: '#0d381e1d',
      margin: 'auto',
      color: '#fff',
      display: 'block',
      marginTop: '2vh',
      borderRadius: '2vh',
      border: 'none',
      padding: '1rem',
      fontWeight: 'bold',
      fontFamily: 'Montserrat, Arial',
    },

    downloadBtnHover: {
      backgroundColor: '#07672d1d',
    },
  };

  if (personnel) {
    const trainingdirector = personnel
      .filter((each) => each.id === certificate[0].training_director_id);

    const traininginstructor = personnel
      .filter((each) => each.id === certificate[0].training_instructor_id);

    const externalfacilitator = personnel
      .filter((each) => each.id === certificate[0].external_facilitator_id);

    const qrCodeData = `${certificate[0].name}, ${student[0].name}, ${student[0].unique_number}`;

    return (
      <div>
        <div>
          <div className="certificate-cont">
            <div id="canvas" className="certificate" ref={certificateRef}>
              <div>
                <img src={sidedesign1} alt="sidedesign" width="80" style={styles.sideDesign} />
                <img src={sidedesign2} alt="sidedesign" width="80" style={styles.sideDesign} />
              </div>
              <div style={styles.certDataSection}>
                <img src={logo} alt="logo" width="80" style={styles.certLogo} />
                <h2 style={styles.certName}>{certificate[0].name}</h2>
                <p style={styles.certTitle}>{certificate[0].title}</p>
                <p className="cert-awardedto">Certificate Awarded to:</p>
                <p style={styles.studName}>{student[0].name}</p>
                <p style={styles.certPurpose}>{certificate[0].purpose}</p>
                <p style={styles.certTitle}>{certificate[0].course}</p>
                <div style={styles.duration}>
                  <span>{formatDate(certificate[0].start_date)}</span>
                  <span> - </span>
                  <span>{formatDate(certificate[0].end_date)}</span>
                </div>
                <div style={styles.personnel}>
                  <div>
                    <img src={trainingdirector[0].signature} alt="sign" width="20" className="signature" />
                    <p style={styles.certAwardedTo}>{trainingdirector[0].name}</p>
                    <p style={styles.personnelTitle}>Training Director</p>
                  </div>
                  <div>
                    <img src={traininginstructor[0].signature} alt="sign" width="20" className="signature" />
                    <p style={styles.certAwardedTo}>{traininginstructor[0].name}</p>
                    <p style={styles.personnelTitle}>External Facilitator</p>
                  </div>
                  <div>
                    <img src={externalfacilitator[0].signature} alt="sign" width="20" className="signature" />
                    <p style={styles.certAwardedTo}>{externalfacilitator[0].name}</p>
                    <p style={styles.personnelTitle}>Training Director</p>
                  </div>
                </div>
                <div style={styles.footer}>
                  <div className="partners-logo-cont">
                    <span><img src={ogtanlogo} alt="ogtanlogo" width="35" className="signature" /></span>
                    <span><img src={isologo} alt="isologo" width="40" className="signature" /></span>
                  </div>
                  <div style={styles.qrCodeCont}>
                    <div className="qrcode"><QRCode value={qrCodeData} size={40} /></div>
                    <p style={styles.certAwardedTo}>
                      ID:
                      <p style={styles.studNum}>{student[0].unique_number}</p>
                    </p>
                  </div>
                </div>
                <p style={styles.certVerify}>
                  Verify certificate ID @ oilchemmudschool.com/certificates
                </p>
              </div>
            </div>
          </div>

          <button style={styles.downloadBtn} type="submit" onClick={downloadCertificate}>⤓ Download Certificate</button>
        </div>
      </div>
    );
  }
}

Certificate.propTypes = {
  foundCertificate: PropTypes.shape({
    certificate: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      training_director_id: PropTypes.string,
      external_facilitator_id: PropTypes.string,
      training_instructor_id: PropTypes.string,
      name: PropTypes.string,
      title: PropTypes.string,
      purpose: PropTypes.string,
      course: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      unique_number: PropTypes.string,
      // Other properties and their PropTypes
    })).isRequired,
    student: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      unique_number: PropTypes.string,
      // Student properties and their PropTypes
    })).isRequired,
    // Add other properties and their PropTypes as needed
  }).isRequired,
};

export default Certificate;
