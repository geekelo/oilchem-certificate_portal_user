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

    const canvas = await html2canvas(certificate, {
      allowTaint: true,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      width: 780,
      height: 1208,
    });

    const imgData = canvas.toDataURL('image/png');
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({ orientation: 'landscape' });
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('certificate.pdf');
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
            <div className="certificate" ref={certificateRef}>
              <div>
                <img src={sidedesign1} alt="sidedesign" width="80" className="side-design" />
                <img src={sidedesign2} alt="sidedesign" width="80" className="side-design" />
              </div>
              <div className="cert-data-section">
                <img src={logo} alt="logo" width="80" className="cert-logo" />
                <h2 className="cert-name">{certificate[0].name}</h2>
                <p className="cert-title">{certificate[0].title}</p>
                <p className="cert-awardedto">Certificate Awarded to:</p>
                <p className="stud-name">{student[0].name}</p>
                <p className="cert-purpose">{certificate[0].purpose}</p>
                <p className="cert-title">{certificate[0].course}</p>
                <div className="duration">
                  <span>
                    {formatDate(certificate[0].start_date)}
                  </span>
                  <span> - </span>
                  <span>
                    {formatDate(certificate[0].end_date)}
                  </span>
                </div>
                <div className="personnel">
                  <div>
                    <img className="signature" src={trainingdirector[0].signature} alt="sign" width="20" />
                    <p className="cert-awardedto">{trainingdirector[0].name}</p>
                    <p className="cert-awardedto personnel-title">Training Director</p>
                  </div>
                  <div>
                    <img className="signature" src={traininginstructor[0].signature} alt="sign" width="20" />
                    <p className="cert-awardedto">{traininginstructor[0].name}</p>
                    <p className="cert-awardedto personnel-title">External Facilitator</p>
                  </div>
                  <div>
                    <img className="signature" src={externalfacilitator[0].signature} alt="sign" width="20" />
                    <p className="cert-awardedto">{externalfacilitator[0].name}</p>
                    <p className="cert-awardedto personnel-title">Training Director</p>
                  </div>
                </div>
                <div className="footer">
                  <div className="partners-logo-cont">
                    <span><img className="signature" src={ogtanlogo} alt="sign" width="35" /></span>
                    <span><img className="signature" src={isologo} alt="sign" width="40" /></span>
                  </div>
                  <div className="qr-code-cont">
                    <div className="qrcode"><QRCode value={qrCodeData} size={40} /></div>
                    <p className="cert-awardedto">
                      ID:
                      {student[0].unique_number}
                    </p>
                  </div>
                </div>
                <p className="cert-verify">Verify certificate ID @ verify.oilchemmudschool.com</p>
              </div>
            </div>
          </div>

          <button className="download-btn" type="submit" onClick={downloadCertificate}> ⤓ Download Certificate</button>
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
