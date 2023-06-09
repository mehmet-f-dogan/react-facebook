import React from "react";
import { ReactComponent as DotsIcon } from "../../Icons/dots.svg";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import EditBox from "../PostCard/EditBox";
import StatusDot from "../../SharedComponents/StatusDot";
import checkActive from "../../Utils/checkActive";
import useVisibility from "../../Hooks/useVisibility";

function PictureCardHeader({
  handleFav,
  handleRemoveFav,
  id,
  first_name,
  last_name,
  profilePic,
  time,
  author,
  activity,
  title,
  postEditFunction,
  image,
  activeStatus,
}) {
  const [editSection, toggleEditSection] = useVisibility();
  const [activeState, setActiveState] = React.useState(false);

  const { uid } = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  let localTime = new Date(time?.toDate()).toString().split(" ");
  localTime.length = 4;
  const localTime1 = new Date(time?.toDate()).toLocaleTimeString();
  const checkTime = new Date().toLocaleString().split(",");
  const originalTime = new Date(time?.toDate()).toLocaleDateString().split(",");

  React.useEffect(() => {
    if (activeStatus) {
      if (checkActive(activeStatus) === "Active Now") {
        setActiveState(true);
      } else {
        setActiveState(false);
      }
    }
  }, [activeStatus]);

  return (
    <div className="postDetailsCardHeadContainer flexBox">
      <div
        className="postDetailsCardHeadBox1"
        onClick={() => navigate(`/profile/${author}`)}
      >
        <img src={profilePic || "/Images/userProfile_icon.png"} alt="pic" />
        {activeState && <StatusDot />}
      </div>
      <div className="postDetailsCardHeadBox2">
        <div className="postDetailsCardActivity flexBox">
          <p>
            <strong
              onClick={() => navigate(`/profile/${author}`)}
            >{`${first_name} ${last_name}`}</strong>
            <span>{activity || ""}</span>
          </p>
        </div>

        <div>
          <span>
            {checkTime[0] === originalTime[0]
              ? localTime1
              : `${localTime.join(" ")}, ${localTime1}`}
          </span>
        </div>
      </div>
      <div
        className="postDetailsCardHeadBox3 flexBox"
        onClick={toggleEditSection}
      >
        <DotsIcon />
        {editSection && (
          <EditBox
            toggleEditSection={toggleEditSection}
            handleRemoveFav={handleRemoveFav}
            author={author}
            uid={uid}
            id={id}
            first_name={first_name}
            last_name={last_name}
            handleFav={handleFav}
            profilePic={profilePic}
            title={title}
            {...postEditFunction}
            image={image}
          />
        )}
      </div>
    </div>
  );
}

export default PictureCardHeader;
