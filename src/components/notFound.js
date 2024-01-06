// NotFound.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import notfound from '../assets/giphy.gif';

function NotFound() {
  return (
    <div className="table-cont">
      <div className="flex-container">
        <div className="loader">
          <img src={notfound} alt="404" width="700" />
          <p>
            OOPS!! PAGE NOT FOUND
          </p>
          <NavLink className="menu-item" style={{ color: '#174217' }} to="/">
            <AiFillHome className="menu-icon" />
            <span>Home</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
