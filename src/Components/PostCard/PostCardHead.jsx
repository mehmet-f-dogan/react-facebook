import React from "react";
import "../../Styles/PostCard/PostCard.css";
import { ReactComponent as DotsIcon } from "../../Icons/dots.svg";
import { useNavigate } from "react-router";
import EditBox from "./EditBox";
import { useSelector } from "react-redux";
import StatusDot from "../../SharedComponents/StatusDot";
import checkActive from "../../Utils/checkActive";
import useVisibility from "../../Hooks/useVisibility";

function PostCardHead({
  handleFav,
  first_name,
  setActivePostId,
  activePostId,
  handleRemoveFav,
  id,
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
    <div className="postCardHeadContainer flexBox">
      <div
        className="postCardHeadBox1 flexBox"
        onClick={() => navigate(`/profile/${author}`)}
      >
        <img src={profilePic || "/Images/userProfile_icon.png"} alt="pic" />
        {activeState && <StatusDot />}
      </div>
      <div className="postCardHeadBox2">
        <div className="postCardActivity flexBox">
          <div onClick={() => navigate(`/profile/${author}`)}>
            <strong>{`${first_name} ${last_name}`}</strong>
          </div>
          {activity && (
            <div>
              <span>{activity}</span>
            </div>
          )}
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
        className="postCardHeadBox3 flexBox"
        onClick={(e) => {
          toggleEditSection(e);
          setActivePostId(id);
        }}
      >
        <DotsIcon />
        {activePostId === id && editSection && (
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

export default PostCardHead;
