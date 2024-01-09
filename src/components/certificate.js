import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
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
  const ogtanlogoRef = useRef();
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
    const ogtanlogo2 = ogtanlogoRef.current;

    // Get the HTML content of the certificate
    // const certificateHTML = certificate.outerHTML;

    const canvas = await html2canvas(ogtanlogo2, {
      allowTaint: true,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
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
        pdf.addImage(imgData, 'PNG', 0, 0);
        await pdf.save('document');
      },
    });

    // pdf.addImage(imgData, 'PNG', 0, 0);
    // pdf.save('certificate.pdf');

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

    const image4 = new Image();
    image4.src = ogtanlogo;

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
      new Promise((resolve) => {
        image4.onload = resolve;
      }),
    ]).then(() => {
      // All images loaded successfully.'
      setImagesLoaded(true);
    });
  }, []);

  const styles = {
    certificatecont: {
      display: 'block',
      paddingRight: '5%',
    },

    certificate: {
      display: 'flex',
      width: '49%',
      backgroundColor: '#fff',
    },

    sidedesign: {
      display: 'block',
      margin: '0',
      width: '100%',
    },

    sidedesignCont: {
      display: 'flex',
      flexDirection: 'column',
      width: '20%',
      gap: '0',
    },

    certDataSection: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: '60%',
    },

    certName: {
      fontSize: '0.5rem',
      textTransform: 'uppercase',
      marginBottom: '0',
    },

    certTitle: {
      fontSize: '5%',
      fontWeight: 'bold',
    },

    certAwardedTo: {
      fontSize: '3%',
    },

    studName: {
      fontSize: '0.7vw',
      borderBottom: '1px dotted #000',
      marginTop: '1%',
    },

    certPurpose: {
      fontSize: '0.35rem',
    },

    duration: {
      fontWeight: 'bold',
      display: 'flex',
      fontSize: '0.3rem',
    },

    personnel: {
      display: 'flex',
      flexDirection: 'row',
      fontSize: '0.3rem',
      justifyContent: 'center',
      alignItems: 'center',
    },

    signature: {
      width: '10%',
    },

    footer: {
      display: 'flex',
      margin: 'auto',
      marginTop: '0',
    },

    qrCodeCont: {
      display: 'flex',
      flexDirection: 'column',
    },

    studNum: {
      fontSize: '0.5rem',
    },

    certVerify: {
      fontSize: '0.3rem',
      marginTop: '0',
    },

    downloadBtn: {
      backgroundColor: '#0d381e1d',
      margin: 'auto',
      color: '#fff',
      display: 'block',
      marginTop: '2%',
      borderRadius: '2%',
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
          <div style={styles.certificateCont}>
            <div id="canvas" size="A4" style={styles.certificate} ref={certificateRef}>
              <div style={styles.sidedesignCont}>
                <img src={sidedesign1} alt="sidedesign" style={styles.sideDesign} />
                <img src={sidedesign2} alt="sidedesign" style={styles.sideDesign} />
              </div>
              <div style={styles.certDataSection}>
                <img src={logo} alt="logo" width="30" style={styles.certLogo} />
                <h2 style={styles.certName}>{certificate[0].name}</h2>
                <p style={styles.certTitle}>{certificate[0].title}</p>
                <p className="cert-awardedto" style={styles.certAwardedTo}>Certificate Awarded to:</p>
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
                    <img src={trainingdirector[0].signature} style={styles.signature} alt="sign" />
                    <p style={styles.certAwardedTo}>{trainingdirector[0].name}</p>
                    <p style={styles.personnelTitle}>Training Director</p>
                  </div>
                  <div>
                    <img src={traininginstructor[0].signature} style={styles.signature} alt="sign" />
                    <p style={styles.certAwardedTo}>{traininginstructor[0].name}</p>
                    <p style={styles.personnelTitle}>External Facilitator</p>
                  </div>
                  <div>
                    <img src={externalfacilitator[0].signature} style={styles.signature} alt="sign" />
                    <p style={styles.certAwardedTo}>{externalfacilitator[0].name}</p>
                    <p style={styles.personnelTitle}>Training Director</p>
                  </div>
                </div>
                <div style={styles.footer}>
                  <div>
                    <span><img src={ogtanlogo} ref={ogtanlogoRef} alt="ogtanlogo" style={styles.signature} /></span>
                    <span><img src={isologo} alt="isologo" style={styles.signature} /></span>
                  </div>
                  <div style={styles.qrCodeCont}>
                    <div style={styles.qrcode}><QRCode value={qrCodeData} size={40} /></div>
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
