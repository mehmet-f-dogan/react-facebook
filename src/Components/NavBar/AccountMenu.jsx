import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchTheme } from "../../Redux/Theme/actions";
import { ReactComponent as DarkModeIcon } from "../../Icons/darkMode.svg";
import { ReactComponent as LogoutIcon } from "../../Icons/logout.svg";
import { useNavigate } from "react-router";
import { logoutSuccess } from "../../Redux/Auth/actions";
import { resetApp } from "../../Redux/App/actions";
import { clearPosts } from "../../Redux/Posts/actions";
import { ReactComponent as Alert } from "../../Icons/alert.svg";
import { database } from "../../Firebase/firebase";
import PopUp from "../../SharedComponents/PopUp";
function AccountMenu() {
  const { profilePic, first_name, last_name, uid, accessibility } = useSelector(
    (store) => store.auth.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dark = useSelector((store) => store.theme.dark);

  const handleTheme = () => {
    dispatch(switchTheme());
  };

  const handleLogout = () => {
    dispatch(clearPosts());
    dispatch(resetApp());
    dispatch(logoutSuccess());
  };

  const handleAccessibility = () => {
    database
      .collection("users")
      .doc(uid)
      .update({ accessibility: !accessibility });
  };
  return (
    <div className="accountMenuContainer">
      <div
        className="AccountMenuUserProfileCard flexBox"
        onClick={() => {
          navigate(`/profile/${uid}`);
        }}
      >
        <img src={profilePic || "/Images/userProfile_icon.png"} alt="Profile" />
        <div>
          <p>{`${first_name} ${last_name}`}</p>
          <small>See your profile</small>
        </div>
      </div>
      <hr />
      <PopUp className="darkModeBox flexBox">
        <DarkModeIcon onClick={handleTheme} />
        <p>Dark Mode</p>
        <div
          className="themeButton flexBox"
          onClick={handleTheme}
          style={{ justifyContent: dark ? "flex-end" : "flex-start" }}
        >
          <div className="themeButtonBubble"></div>
        </div>
      </PopUp>
      <PopUp className="accessibilityBox flexBox">
        <Alert onClick={handleTheme} />
        <p>Accessibility</p>
        <div
          className="accessibilityButton flexBox"
          onClick={handleAccessibility}
          style={{ justifyContent: accessibility ? "flex-end" : "flex-start" }}
        >
          <div className="accessibilityButtonBubble"></div>
        </div>
      </PopUp>
      <div className="logOutBox flexBox" onClick={handleLogout}>
        <div className="logoutIconWrap flexBox">
          <LogoutIcon />
        </div>

        <p>Log Out</p>
      </div>
    </div>
  );
}

export default AccountMenu;
