import React from "react";
import { useNavigate } from "react-router";
import { database } from "../../Firebase/firebase";

function CommentBox({ comment, author, time }) {
  const [userData, setUserData] = React.useState({});
  const { first_name, last_name, profilePic } = userData;

  const localTime = new Date(time.toDate()).toLocaleTimeString();
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = database
      .collection("users")
      .doc(author)
      .onSnapshot((doc) => {
        setUserData(doc.data());
      });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="postCardInputBox flexBox">
      <img
        onClick={() => navigate(`/profile/${author}`)}
        src={profilePic || "/Images/userProfile_icon.png"}
        alt="otherspic"
      />
      <div className="addComment flexBox">
        <div className="addCommentBox flexBox">
          <strong onClick={() => navigate(`/profile/${author}`)}>{`${
            first_name || ""
          } ${last_name || ""}`}</strong>
          <small>{comment || ""}</small>
        </div>
        <div className="postCardCommentLikeandReply flexBox">
          <small>Like </small>
          <samp>·</samp>
          <small>Reply </small>
          <samp>·</samp>
          <p>{localTime || ""}</p>
        </div>
      </div>
    </div>
  );
}

export default CommentBox;
