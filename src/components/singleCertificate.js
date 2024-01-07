import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { displayCertificates, displayPersonnel, displayStudents } from '../redux/certificateSlice';
import Certificate from './certificate';
import CopyButton from './copyBtn';
import '../stylesheets/notFound.css';
import spinner from '../assets/rippleloader.gif';

function SingleCertificate() {
  const dispatch = useDispatch();
  const location = useLocation();
  const fullURL = window.location.href;
  const [studentId, setStudentId] = useState('');
  const [foundCertificate, setCertificate] = useState({});
  const certificates = useSelector((state) => state.display_certificates.certificates);
  const students = useSelector((state) => state.display_certificates.students);

  const searchCert = () => {
    const targetStudent = students.filter((each) => each.unique_number === studentId);
    if (targetStudent.length > 0) {
      const targertCetificate = certificates
        .filter((each) => each.student_id === targetStudent[0].id);
      if (targertCetificate.length > 0) {
        setCertificate({
          certificate: targertCetificate,
          student: targetStudent,
        });
      }
    }
  };

  useEffect(() => {
    searchCert();
  }, [certificates]);

  useEffect(() => {
    dispatch(displayCertificates());
    dispatch(displayStudents());
    dispatch(displayPersonnel());
    const id = location.pathname.split('/').pop();
    setStudentId(id);
  }, [dispatch]);

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
        <br />
        <Certificate foundCertificate={foundCertificate} />
      </div>
    );
  }
  return (
    <div className="table-cont">
      <div className="flex-container loader">
        <img src={spinner} alt="spinner" width="700" />
      </div>
      <p>
        CHECKING...
      </p>
      <NavLink className="singlepage-menu-item" style={{ color: '#174217' }} to="/">
        <AiFillHome className="menu-icon" />
      </NavLink>
    </div>
  );
}

export default SingleCertificate;
