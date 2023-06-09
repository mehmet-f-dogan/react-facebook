import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import AccessibilityInfo from "../../SharedComponents/AccessibilityInfo";
import "../../Styles/ProfileProgressBox/ProfileProgressBox.css";
import { ReactComponent as Alert } from "../../Icons/alert.svg";
function ProfileProgressBox() {
  const [progress, setProgress] = React.useState(0);
  const [accessabilityVisibility, setAccessabilityVisibility] =
    React.useState(false);
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();
  React.useEffect(() => {
    setProgress((Object.keys(user).length / 16) * 100);
  }, [user]);
  return user?.accessibility && progress < 85 ? (
    <div className="profileProgressBoxContainer">
      <div className="profileProgressBoxHeader flexBox">
        <h1>Update Profile info</h1>
        <Alert
          onMouseEnter={() => setAccessabilityVisibility(true)}
          onMouseLeave={() => setAccessabilityVisibility(false)}
        />
        {accessabilityVisibility && <AccessibilityInfo />}
      </div>

      <div
        className="profileProgressBarBoxContainer flexBox"
        onClick={() => navigate(`/profile/${user?.uid}`)}
      >
        <img
          src={user.profilePic || "/Images/userProfile_icon.png"}
          alt="Photo"
        />
        <div className="userDetailsProgressBar">
          <p>{`${user.first_name} ${user.last_name}`}</p>
          <div className="profileProgressBarBox">
            <div
              className="profileProgressBar flexBox"
              style={{
                width: `${progress}%`,
                backgroundColor:
                  progress < 65 ? "rgb(255, 122, 105)" : "#1877f2",
              }}
            >
              <p>{`${Math.floor(progress)}%`}</p>
            </div>
          </div>
        </div>
      </div>
      <ul onClick={() => navigate(`/profile/${user?.uid}`)}>
        {!user.profilePic && <li>Update your profile picture</li>}
        {!user.coverPic && <li>Update your cover photo</li>}
        <li>Update your info</li>
      </ul>
    </div>
  ) : null;
}

export default ProfileProgressBox;
