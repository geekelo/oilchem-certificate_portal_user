import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Certificate from './certificate';
import { displayCertificates, displayPersonnel, displayStudents } from '../redux/certificateSlice';

function Search() {
  const dispatch = useDispatch();
  const certificates = useSelector((state) => state.display_certificates.certificates);
  const students = useSelector((state) => state.display_certificates.students);
  const [searchValue, setSearchValue] = useState('');
  const [foundCertificate, setCertificate] = useState({});

  useEffect(() => {
    dispatch(displayCertificates());
    dispatch(displayStudents());
    dispatch(displayPersonnel());
  }, [dispatch]);

  const handlesubmit = () => {
    const targetStudent = students.filter((each) => each.unique_number === searchValue);
    if (targetStudent.length > 0) {
      const targertCetificate = certificates
        .filter((each) => each.student_id === targetStudent[0].id);
      setCertificate({
        certificate: targertCetificate,
        student: targetStudent,
      });
      alert('found');
    } else {
      alert('Non found');
    }
  };

  const handlechange = (e) => {
    setSearchValue(
      e.target.value,
    );
  };

  console.log(certificates);
  console.log(students);
  return (
    <div className="search-cont">
      <div>
        <input
          type="text"
          name="searchNumber"
          value={searchValue}
          placeholder="Input student number"
          onChange={handlechange}
        />
        <button type="submit" onClick={handlesubmit}>Search</button>
      </div>
      {foundCertificate.certificate !== undefined
        ? (<Certificate foundCertificate={foundCertificate} />)
        : (<p>No certificate found yet</p>)}
    </div>
  );
}

export default Search;
