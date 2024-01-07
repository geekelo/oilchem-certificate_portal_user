import React from 'react';
import logo from '../assets/cert-logo.png';
import '../stylesheets/header.css';

function Header() {
  return (
    <div className="header">
      <img className="logo" src={logo} alt="header" width="100" />
      <p className="header-name">OILCHEM MUD SCHOOL</p>
      <h2 className="header-title">
        Certificate Verification
        <br />
        Portal
      </h2>
    </div>
  );
}

export default Header;
