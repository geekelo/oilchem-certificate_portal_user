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

  const searchcert = () => {
    const targetStudent = students.filter((each) => each.unique_number === studentId);
    if (targetStudent.length > 0) {
      const targertCetificate = certificates
        .filter((each) => each.student_id === targetStudent[0].id);
      if (targertCetificate.length > 0) {
        setCertificate({
          certificate: targertCetificate,
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
    const fetchData = () =>
       Promise.all([
        dispatch(displayCertificates()),
        dispatch(displayStudents()),
        dispatch(displayPersonnel()),
      ]);

    fetchData().then(() => {
      const id = location.pathname.split('/').pop();
      setStudentId(id);
      searchcert();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="search-cont">
      <NavLink className="singlepage-menu-item" style={{ color: '#174217' }} to="/">
        <AiFillHome className="menu-icon" />
      </NavLink>
      {foundCertificate.certificate
        ? (
          <>
            <div className="notification">
              Link to Certificate -
              <CopyButton textToCopy={fullURL} />
            </div>
            <Certificate foundCertificate={foundCertificate} />
          </>
        )
        : (
          <div className="flex-container loader">
            <div className="loader">
              <img src={spinner} alt="spinner" width="300" />
            </div>
            <p>CHECKING...</p>
          </div>
        )}
    </div>
  );
}

export default SingleCertificate;
