import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SearchResultCard({
  first_name,
  last_name,
  uid,
  profilePic,
  lives,
  closeSearchResultBox,
}) {
  const navigate = useNavigate();
  const handleRedirect = () => {
    closeSearchResultBox();
    navigate(`/profile/${uid}`);
  };
  const friends = useSelector((store) => store.auth.friends);
  const user = useSelector((store) => store.auth.user);
  return (
    <div className="searchResultCard flexBox" onClick={handleRedirect}>
      <img src={profilePic || "/Images/userProfile_icon.png"} alt="Pic" />
      <div className="searchResultCardUserDetails flexBox">
        <p>{`${first_name} ${last_name}`}</p>
        {JSON.stringify(user).includes(uid) ? (
          <small>You</small>
        ) : JSON.stringify(friends).includes(uid) ? (
          <small>Friend</small>
        ) : lives ? (
          <small>{lives}</small>
        ) : null}
      </div>
    </div>
  );
}

export default SearchResultCard;
