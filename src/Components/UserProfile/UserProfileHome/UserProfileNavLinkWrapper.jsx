import React from "react";
import { Link, useLocation } from "react-router-dom";

function UserProfileNavLinkWrapper({ path, children, extraClass }) {
  const location = useLocation();

  return (
    <Link
      to={path}
      className={
        location.pathname === path
          ? `userProfileNavMenuName active ${extraClass}`
          : `userProfileNavMenuNameBox userProfileNavMenuName ${extraClass}`
      }
    >
      {children}
    </Link>
  );
}

export default UserProfileNavLinkWrapper;
