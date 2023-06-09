import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { shallowEqual, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { database } from "../../Firebase/firebase";
import timeConverter from "../../Utils/timeConverter";

function FriendsPageCard({ senderId, time }) {
  const [senderDetails, setSenderDetails] = useState(null);

  const dark = useSelector((state) => state.theme.dark, shallowEqual);
  const uid = useSelector((state) => state.auth.user.uid, shallowEqual);

  const handleAcceptFriendRequest = () => {
    let time = new Date();

    database
      .collection("users")
      .doc(senderDetails.uid)
      .collection("friends")
      .add({ friendId: uid, time });
    database
      .collection("users")
      .doc(uid)
      .collection("friends")
      .add({ friendId: senderDetails.uid, time });
    database
      .collection("users")
      .doc(senderDetails.uid)
      .collection("sentRequests")
      .doc(`${uid}${senderDetails.uid}`)
      .delete();
    database
      .collection("users")
      .doc(uid)
      .collection("friendRequests")
      .doc(`${uid}${senderDetails.uid}`)
      .delete();

    const payload = {
      author: uid,
      isRead: false,
      tag: `friend`,
      action: `accepted your friend request.`,
      time: new Date(),
    };
    database
      .collection("users")
      .doc(senderDetails.uid)
      .collection("notifications")
      .add(payload);
  };

  const handleDeleteFriendRequest = () => {
    database
      .collection("users")
      .doc(senderDetails.uid)
      .collection("sentRequests")
      .doc(`${uid}${senderDetails.uid}`)
      .delete();
    database
      .collection("users")
      .doc(uid)
      .collection("friendRequests")
      .doc(`${uid}${senderDetails.uid}`)
      .delete();
  };

  useEffect(() => {
    database
      .collection("users")
      .doc(senderId)
      .get()
      .then((res) => {
        setSenderDetails(res.data());
      });
  }, [senderId]);

  return senderDetails ? (
    <div className="flexBox senderDetailsContainer">
      <div className="senderProfilePicCover">
        <Link
          to={
            window.innerWidth < 992
              ? `/profile/${senderId}`
              : `/friends/${senderId}`
          }
        >
          <img
            className="senderProfilePic"
            src={senderDetails.profilePic || "/Images/userProfile_icon.png"}
            alt="profilePic"
          />
        </Link>
      </div>
      <div className="flexBox senderDetailsBox">
        <div className="senderDetailsLinkCover flexBox">
          <Link
            className="senderDetailsLink"
            to={
              window.innerWidth < 992
                ? `/profile/${senderId}`
                : `/friends/${senderId}`
            }
          >
            <p>{`${senderDetails.first_name} ${senderDetails.last_name}`}</p>
          </Link>
          <div className="senderDetailsTimeConverter">
            {timeConverter(time)}
          </div>
        </div>
        <div className="flexBox senderDetailsButtons">
          <button onClick={handleAcceptFriendRequest}>Confirm</button>
          <button onClick={handleDeleteFriendRequest}>Delete</button>
        </div>
      </div>
    </div>
  ) : (
    <SkeletonTheme
      color={dark ? "#202020" : "#dadada"}
      highlightColor={dark ? "#444" : "#f3efef"}
    >
      <div className="flexBox senderDetailsContainer">
        <div className="senderProfilePicCover">
          <Skeleton
            style={{ borderRadius: "50%" }}
            width="100%"
            height="100%"
          />
        </div>
        <div className="flexBox senderDetailsBox">
          <div className="senderDetailsLink">
            <Skeleton style={{ borderRadius: "50px" }} width="80px" />
          </div>
          <div className="flexBox senderDetailsButtons"></div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default FriendsPageCard;
