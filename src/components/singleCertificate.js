import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { displayCertificates, displayPersonnel, displayStudents } from '../redux/certificateSlice';
import Certificate from './certificate';
import CopyButton from './copyBtn';
import spinner from '../assets/rippleloader.gif';
import '../stylesheets/notFound.css';
import '../stylesheets/search.css';

function SingleCertificate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fullURL = window.location.href;
  const [studentId, setStudentId] = useState('');
  const [foundCertificate, setCertificate] = useState({});
  const certificates = useSelector((state) => state.display_certificates.certificates);
  const students = useSelector((state) => state.display_certificates.students) || [];

  const searchCert = () => {
    const targetStudent = students.find((each) => each.unique_number === studentId);
    if (targetStudent) {
      const targetCertificate = certificates.find((each) => each.student_id === targetStudent.id);
      if (targetCertificate) {
        setCertificate({
          certificate: targetCertificate,
          student: targetStudent,
        });
      } else {
        navigate('/404');
      }
    } else {
      navigate('/404');
    }
  };

  useEffect(() => {
    dispatch(displayCertificates());
    dispatch(displayStudents());
    dispatch(displayPersonnel());

    const id = location.pathname.split('/').pop();
    setStudentId(id);

    if (students.length > 0 && certificates.length > 0) {
      searchCert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, !students]);

  if (foundCertificate.certificate) {
    return (
      <div className="search-cont">
        <NavLink className="singlepage-menu-item" style={{ color: '#174217' }} to="/">
          <AiFillHome className="menu-icon" />
        </NavLink>
        <div className="notification">
          Link to Certificate -
          <CopyButton textToCopy={fullURL} />
        </div>
        <Certificate foundCertificate={foundCertificate} />
      </div>
    );
  }

  // Display loading spinner only if the foundCertificate is empty
  return (
    <div className="table-cont">
      {Object.keys(foundCertificate).length === 0 && (
        <div className="flex-container loader">
          <div className="loader">
            <img src={spinner} alt="spinner" width="300" />
          </div>
          <p>CHECKING...</p>
        </div>
      )}
      <NavLink className="singlepage-menu-item" style={{ color: '#174217' }} to="/">
        <AiFillHome className="menu-icon" />
      </NavLink>
    </div>
  );
}

export default SingleCertificate;
