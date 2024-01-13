import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { displayCertificates, displayPersonnel, displayStudents } from '../redux/certificateSlice';
import Certificate from './certificate';
import CopyButton from './copyBtn';
import spinner from '../assets/rippleloader.gif';
import '../stylesheets/notFound.css';

function SingleCertificate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fullURL = window.location.href;
  const [studentId, setStudentId] = useState('');
  const [pageNotFound, setpageNotFound] = useState('no');
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
    } else {
      setpageNotFound('yes');
    }
  };

  useEffect(() => {
    searchCert();
  }, [studentId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch actions and wait for them to complete
        await dispatch(displayCertificates());
        await dispatch(displayStudents());
        await dispatch(displayPersonnel());

        // Once all actions are completed, get the student id
        const id = location.pathname.split('/').pop();
        setStudentId(id);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Invoke the fetchData function
  }, [dispatch, location.pathname]);

  // useEffect(() => {
  //   dispatch(displayCertificates());
  //   dispatch(displayStudents());
  //   dispatch(displayPersonnel());
  //   const id = location.pathname.split('/').pop();
  //   setStudentId(id);
  // }, [dispatch]);

  if (pageNotFound === 'yes') {
    navigate('/404');
  }

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
  return (
    <div className="table-cont">
      <div className="flex-container loader">
        <div className="loader">
          <img src={spinner} alt="spinner" width="300" />
        </div>
        <p>
          CHECKING...
        </p>
      </div>
      <NavLink className="singlepage-menu-item" style={{ color: '#174217' }} to="/">
        <AiFillHome className="menu-icon" />
      </NavLink>
    </div>
  );
}

export default SingleCertificate;
