import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { database } from "../../Firebase/firebase";
import NotificationBubble from "../../SharedComponents/NotificationBubble";
import StatusDot from "../../SharedComponents/StatusDot";
import checkActive from "../../Utils/checkActive";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function ChatRoomCard({ chatID, authors }) {
  const dark = useSelector((store) => store.theme.dark);
  const uid = useSelector((store) => store.auth.user.uid);
  const [userDetails, setUserDetails] = React.useState({});
  const [messages, setMessages] = React.useState([]);
  const [activeState, setActiveState] = React.useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    const senderID = authors.filter((id) => id !== uid);
    const unsubscribe = database
      .collection("users")
      .doc(senderID[0])
      .onSnapshot((doc) => {
        setUserDetails(doc.data());
      });
    return () => {
      unsubscribe();
    };
  }, [uid, authors]);
  React.useEffect(() => {
    const unsubscribe = database
      .collection("chatRooms")
      .doc(chatID)
      .collection("messages")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      });
    return () => {
      unsubscribe();
    };
  }, []);
  React.useEffect(() => {
    if (userDetails.activeStatus) {
      if (checkActive(userDetails.activeStatus) === "Active Now") {
        setActiveState(true);
      } else {
        setActiveState(false);
      }
    }
  }, [userDetails.activeStatus]);
  const time = new Date(messages[0]?.time?.toDate()).toLocaleTimeString();
  return userDetails.first_name ? (
    <div
      className="chatRoomCardBox flexBox"
      onClick={() => navigate(`/messenger/${chatID}`)}
    >
      <div className="chatRoomUserImage">
        {activeState && <StatusDot width="12px" height="12px" />}
        <NotificationBubble
          number={
            messages.filter((el) => el.author !== uid && !el.isRead).length
          }
        />
        <img
          src={userDetails?.profilePic || "/Images/userProfile_icon.png"}
          alt="User"
        />
      </div>
      <div className="chatRoomUserDetails">
        <h2>{`${userDetails?.first_name} ${userDetails?.last_name}`}</h2>
        <small className="flexBox">
          <p className="messengerText">{messages[0]?.text}</p>{" "}
          <span>{time !== "Invalid Date" && time}</span>
        </small>
      </div>
    </div>
  ) : (
    <div className="chatRoomCardBox flexBox">
      <SkeletonTheme
        width={200}
        color={dark ? "#202020" : "#dadada"}
        highlightColor={dark ? "#444" : "#f3efef"}
      >
        <div className="flexBox">
          <Skeleton
            style={{ margin: "0 5px" }}
            circle={true}
            height={50}
            width={50}
          />
          <Skeleton style={{ borderRadius: "25px" }} width={130} height={15} />
        </div>
      </SkeletonTheme>
    </div>
  );
}

export default ChatRoomCard;
