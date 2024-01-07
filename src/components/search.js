import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Certificate from './certificate';
import { displayCertificates, displayPersonnel, displayStudents } from '../redux/certificateSlice';
import '../stylesheets/search.css';
import CopyButton from './copyBtn';

function Search() {
  const dispatch = useDispatch();
  const certificates = useSelector((state) => state.display_certificates.certificates);
  const students = useSelector((state) => state.display_certificates.students);
  const [searchValue, setSearchValue] = useState('');
  const [foundCertificate, setCertificate] = useState({});
  const [response, setResponse] = useState('');
  const [fullURL, setfullURL] = useState('');
  const url = window.location.href;

  // HANDLE NOTIFICATIONS
  useEffect(() => {
    const res = localStorage.getItem('status');
    if (res) {
      const resParse = JSON.parse(res);
      const curResponse = resParse.response;
      setResponse(curResponse);
      setTimeout(() => {
        localStorage.removeItem('status');
        // Log after the timeout
      }, 10000);
    }
    dispatch(displayCertificates());
    dispatch(displayStudents());
    dispatch(displayPersonnel());
  }, [dispatch]);

  // HANDLE SEARCH
  const handlesubmit = () => {
    const targetStudent = students.filter((each) => each.unique_number === searchValue);
    if (targetStudent.length > 0) {
      const targertCetificate = certificates
        .filter((each) => each.student_id === targetStudent[0].id);
      if (targertCetificate.length > 0) {
        setCertificate({
          certificate: targertCetificate,
          student: targetStudent,
        });
        setSearchValue('');
        const statusObject = { response: '' };
        const statusString = JSON.stringify(statusObject);
        localStorage.setItem('status', statusString);
        setResponse('Certificate Found!');
        setfullURL(`${url}${searchValue}`);
      } else {
        const statusObject = { response: 'The Certificate ID Is Invalid Please check again and input a valid certificate ID' };
        const statusString = JSON.stringify(statusObject);
        localStorage.setItem('status', statusString);
        window.location.reload();
      }
    } else {
      const statusObject = { response: 'The Certificate ID is Invalid please check again and input a valid certificate ID' };
      const statusString = JSON.stringify(statusObject);
      localStorage.setItem('status', statusString);
      window.location.reload();
    }
  };

  const handlechange = (e) => {
    setSearchValue(
      e.target.value,
    );
  };

  return (
    <div className="search-cont">
      <div className="search">
        <input
          type="text"
          name="searchNumber"
          value={searchValue}
          placeholder="Input a valid Certificate number"
          onChange={handlechange}
        />
        <button className="search-btn" type="submit" onClick={handlesubmit}>Search</button>
      </div>
      {foundCertificate.certificate !== undefined
        ? (
          <div>
            <div className="notification">
              {response}
              &nbsp;
              <CopyButton textToCopy={fullURL} />
            </div>
            <Certificate foundCertificate={foundCertificate} />
          </div>
        )
        : (<p className="notification">{response}</p>)}
    </div>
  );
}

export default Search;
