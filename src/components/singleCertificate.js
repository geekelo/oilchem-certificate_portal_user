import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { displayCertificates, displayPersonnel, displayStudents } from '../redux/certificateSlice';
import Certificate from './certificate';
import CopyButton from './copyBtn';

function SingleCertificate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fullURL = window.location.href;
  const [studentId, setStudentId] = useState('');
  const [pageNotFound, setpageNotFound] = useState(1);
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
      setpageNotFound(pageNotFound + 1);
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

  if (pageNotFound === 4) {
    navigate('/404');
  }

  if (foundCertificate.certificate) {
    return (
      <div className="search-cont">
        <div className="notification">
          Link to Certificate -
          <CopyButton textToCopy={fullURL} />
        </div>
        <br />
        <Certificate foundCertificate={foundCertificate} />
      </div>
    );
  }
}

export default SingleCertificate;
