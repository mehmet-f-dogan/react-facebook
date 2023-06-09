import React from "react";
import { useSelector } from "react-redux";
import { database } from "../../Firebase/firebase";
import { ReactComponent as EmojiIcon } from "../../Icons/happyFace.svg";
import CommentBox from "../PostCard/CommentBox";
import EmojiMart from "../../SharedComponents/EmojiMart";

function PictureCardComment({ postId, comments, userData }) {
  const [comment, setComment] = React.useState("");
  const [emojiVisibility, setEmojiVisibility] = React.useState(false);

  const { uid, profilePic } = useSelector((store) => store.auth.user);
  const handleChange = (e) => {
    const { value } = e.target;
    setComment(value);
  };
  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      const payload = {
        comment,
        time: new Date(),
        author: uid,
      };
      const notificationPayload = {
        author: uid,
        time: new Date(),
        action: "commented on your post.",
        comment,
        isRead: false,
        tag: "comment",
      };
      database
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add(payload);
      if (uid !== userData.uid) {
        database
          .collection("users")
          .doc(userData.uid)
          .collection("notifications")
          .add(notificationPayload);
      }

      setComment("");
    }
  };

  const handleEmoji = (emoji) => {
    setComment(comment + emoji.native);
  };

  return (
    <div className="postDetailsCardCommentContainer scroll flexBox">
      <div className="postDetailsModalCommentBox scroll">
        {comments?.map((el) => (
          <CommentBox key={el.commentId} {...el} />
        ))}
      </div>
      <div className="postDetailsCardInputBox flexBox">
        <img src={profilePic || "/Images/userProfile_icon.png"} alt="mypic" />
        <div className="addComment flexBox">
          <div className="commentInput flexBox">
            <input
              autoComplete="off"
              autoFocus
              type="text"
              name="comment"
              id="comment"
              value={comment}
              onChange={handleChange}
              onKeyDown={handleSubmit}
              placeholder="Write a comment..."
            />
            <div className="postEmojiMartContainer flexBox">
              <EmojiIcon onClick={() => setEmojiVisibility(!emojiVisibility)} />
              {/* <CameraIcon/> */}
              {emojiVisibility && (
                <div className="commentInput1">
                  <EmojiMart handleEmoji={handleEmoji} />
                </div>
              )}
            </div>
          </div>
          <small>Press Enter to post.</small>
        </div>
      </div>
    </div>
  );
}

export default PictureCardComment;
