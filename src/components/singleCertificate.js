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
  const certificatesstatus = useSelector((state) => state.display_certificates.certificatesstatus) || 'idle';
  const studentsstatus = useSelector((state) => state.display_certificates.studentsstatus) || 'idle';
  const status = certificatesstatus !== 'idle' && certificatesstatus !== 'loading' && studentsstatus !== 'loading' && studentsstatus !== 'idle' ? true : null;

  useEffect(() => {
    dispatch(displayCertificates());
    dispatch(displayStudents());
    dispatch(displayPersonnel());

    const id = location.pathname.split('/').pop();
    setStudentId(id);
    console.log('yes');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, location.pathname]);

  if (status) {
    console.log('no');
    console.log(status);
    console.log(studentsstatus);
    console.log(certificatesstatus);
    console.log(studentId);
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
  }

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
