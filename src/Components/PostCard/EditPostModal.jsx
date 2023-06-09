import React from "react";
import { ReactComponent as EmojiIcon } from "../../Icons/emoji.svg";
import { ReactComponent as CloseIcon } from "../../Icons/close.svg";
import { ReactComponent as FriendsIcon } from "../../Icons/friends.svg";
import { ReactComponent as DownArrowIcon } from "../../Icons/downArrow.svg";
import EmojiMart from "../../SharedComponents/EmojiMart";
import PopUp from "../../SharedComponents/PopUp";
import useVisibility from "../../Hooks/useVisibility";

function EditPostModal({
  profilePic,
  toggleEditSection,
  handleEditModal,
  first_name,
  last_name,
  toggleEditModal,
  handleEditPost,
  editTitle,
  setEditTitle,
}) {
  const [emojiMart, toggleEmojiMart, closeEmojiMart] = useVisibility();

  const handleEditPostButton = () => {
    handleEditPost(editTitle);
    toggleEditSection();
    handleEditModal();
  };

  const handleEmoji = (emoji) => {
    setEditTitle(editTitle + emoji.native);
  };

  return (
    <div className="editPostModal">
      <PopUp
        className="editedPostContainer"
        onClick={() => {
          closeEmojiMart();
        }}
      >
        <div className="editPostHeader flexBox">
          <div className="editPostTitle flexBox">
            <p>Edit Post</p>
          </div>
          <div
            className="editPostCloseButton flexBox"
            onClick={handleEditModal}
          >
            <CloseIcon />
          </div>
        </div>
        <div className="editPostUserImage flexBox">
          <img src={profilePic || "/Images/userProfile_icon.png"} alt="User" />
          <div>
            <p>{`${first_name || ""} ${last_name || ""}`} </p>
            <div className="editPrivacySelect flexBox">
              <FriendsIcon />
              <p>Friends</p>
              <DownArrowIcon />
            </div>
          </div>
        </div>
        <div className="editPostInput flexBox">
          <div className="flexBox inputTextBox">
            <textarea
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              cols="30"
              rows={"5"}
              placeholder={`Whats on your mind, ${first_name || ""}?`}
            ></textarea>
            <div className="editPostEmojiMartContainer">
              <EmojiIcon onClick={toggleEmojiMart} />
              {emojiMart && (
                <PopUp className="editPostEmojiMartBox">
                  <EmojiMart handleEmoji={handleEmoji} />
                </PopUp>
              )}
            </div>
          </div>
        </div>
        <div className="editPostButton">
          <button onClick={handleEditPostButton}>Edit Post</button>
        </div>
      </PopUp>
    </div>
  );
}

export default EditPostModal;
