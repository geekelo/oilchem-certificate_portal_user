import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { displayPersonnel } from '../redux/certificateSlice';

function Certificate({ foundCertificate }) {
  const dispatch = useDispatch();
  const personnel = useSelector((state) => state.display_certificates.personnel);
  const { certificate, student } = foundCertificate;
  console.log(foundCertificate);

  useEffect(() => {
    dispatch(displayPersonnel());
  }, [dispatch]);

  if (personnel) {
    const trainingdirector = personnel
      .filter((each) => each.id === certificate[0].training_director_id);

    const traininginstructor = personnel
      .filter((each) => each.id === certificate[0].training_instructor_id);

    const externalfacilitator = personnel
      .filter((each) => each.id === certificate[0].external_facilitator_id);

    console.log(trainingdirector);
    return (
      <div>
        <div>Certificate</div>
        <p>{certificate[0].name}</p>
        <p>{certificate[0].title}</p>
        <p>{certificate[0].course}</p>
        <p>{certificate[0].purpose}</p>
        <p>{certificate[0].start_date}</p>
        <p>{certificate[0].end_date}</p>
        <p>{trainingdirector[0].name}</p>
        <p>{trainingdirector[0].signature}</p>
        <p>{traininginstructor[0].name}</p>
        <p>{traininginstructor[0].signature}</p>
        <p>{externalfacilitator[0].name}</p>
        <p>{externalfacilitator[0].signature}</p>
        <p>{student[0].name}</p>
        <p>{student[0].unique_number}</p>

      </div>
    );
  }
}

Certificate.propTypes = {
  foundCertificate: PropTypes.shape({
    certificate: PropTypes.objectOf(PropTypes.string).isRequired,
    student: PropTypes.objectOf(PropTypes.string).isRequired,
    // Add other properties and their PropTypes as needed
  }).isRequired,
};

export default Certificate;
