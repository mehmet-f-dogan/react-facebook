import React from "react";
import "../../Styles/NavBar/NavBar.css";
import { ReactComponent as SearchIcon } from "../../Icons/search.svg";
import { ReactComponent as MainLogo } from "../../Icons/main-logo.svg";
import { ReactComponent as FavIcon } from "../../Icons/fav.svg";
import { ReactComponent as HomeIcon } from "../../Icons/home.svg";
import { ReactComponent as UsersIcon } from "../../Icons/users.svg";
import { ReactComponent as VideoIcon } from "../../Icons/video.svg";
import { ReactComponent as CreateIcon } from "../../Icons/create.svg";
import { ReactComponent as MessageIcon } from "../../Icons/message.svg";
import { ReactComponent as NotificationIcon } from "../../Icons/notification.svg";
import { ReactComponent as DownArrowIcon } from "../../Icons/downArrow.svg";
import { ReactComponent as MenuIcon } from "../../Icons/menu.svg";
import { ReactComponent as BackIcon } from "../../Icons/back.svg";
import IconWrapper from "./IconWrapper";
import IconWrapperCircle from "./IconWrapperCircle";
import { useNavigate } from "react-router";
import AccountMenu from "./AccountMenu";
import { useSelector } from "react-redux";
import NewPostModal from "../NewPost/NewPostModal";
import Notifications from "./Notifications";
import SearchResult from "./SearchResult";
import useVisibility from "../../Hooks/useVisibility";
import { database } from "../../Firebase/firebase";
function NavBar({ refresh, handleRefresh }) {
  const [postModal, togglePostModal] = useVisibility();
  const [notification, toggleNotification, closeNotification] = useVisibility();
  const [account, toggleAccount, closeAccount] = useVisibility();
  const [searchBox, toggleSearchBox] = useVisibility();
  const [search, setSearch] = React.useState("");
  const [searchResultBox, , closeSearchResultBox, openSearchResultBox] =
    useVisibility();
  const path = React.useRef(true);
  const navigate = useNavigate();
  const { profilePic, first_name, uid } = useSelector(
    (store) => store.auth.user
  );
  const notifications = useSelector((store) => store.auth.notifications);
  const [messageCount, setMessageCount] = React.useState(0);
  const chatRooms = useSelector((store) => store.app.chatRooms);
  React.useEffect(() => {
    let unsubscribe = [];
    chatRooms.map((room, i) => {
      unsubscribe[i] = database
        .collection("chatRooms")
        .doc(room.chatID)
        .collection("messages")
        .where("isRead", "==", false)
        .onSnapshot((snap) => {
          setMessageCount(snap.docs.filter((doc) => !doc.data().isRead).length);
        });
    });
    return () => {
      unsubscribe.forEach((el) => el());
    };
  }, [chatRooms]);
  const handleMenu = () => {
    if (path.current) {
      path.current = !path.current;
      navigate("/menu");
    } else {
      path.current = !path.current;
      history.goBack();
    }
  };
  const handleNotificationVisibility = (e) => {
    toggleNotification(e);
    closeAccount(e);
  };
  const handleAccountVisibility = (e) => {
    closeNotification(e);
    toggleAccount(e);
  };
  if (notifications.filter((item) => !item.isRead)?.length) {
    document.title = `(${
      notifications.filter((item) => !item.isRead)?.length
    }) Facebook`;
  } else {
    document.title = `Facebook`;
  }
  React.useEffect(() => {
    if (search) {
      openSearchResultBox();
    } else {
      closeSearchResultBox();
    }
  }, [search]);

  return (
    <div className="navBarContainer flexBox">
      {searchResultBox && search && (
        <SearchResult
          closeSearchResultBox={closeSearchResultBox}
          query={search}
        />
      )}
      <div className="navBarLogo flexBox">
        {!searchBox ? (
          <MainLogo onClick={() => navigate("/")} />
        ) : (
          <div
            className="searchBarBackButton flexBox"
            onClick={toggleSearchBox}
          >
            <BackIcon />
          </div>
        )}
        <div
          className="navBarSearchBox flexBox"
          style={{ padding: searchBox && "4px 10px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mainSearchIcon flexBox">
            <SearchIcon />
          </div>
          <div className="mainSearchIconResponse flexBox">
            <SearchIcon onClick={toggleSearchBox} />
          </div>

          <input
            type="text"
            onClick={openSearchResultBox}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Facebook"
            style={{ display: searchBox && "flex" }}
            className="navBarSearchBoxInput"
          />
        </div>
        {!searchBox && (
          <div className="navBarMenu flexBox">
            <MenuIcon onClick={handleMenu} />
          </div>
        )}
      </div>

      <div className="navBarMainHeader flexBox">
        <IconWrapper path="/" label="Home" handleRefresh={handleRefresh}>
          <HomeIcon />
        </IconWrapper>
        <IconWrapper
          path="/videos"
          label="Videos"
          handleRefresh={handleRefresh}
        >
          <VideoIcon />
        </IconWrapper>
        <IconWrapper
          path="/friends/new"
          label="Friends"
          handleRefresh={handleRefresh}
        >
          <UsersIcon />
        </IconWrapper>
        <IconWrapper
          path="/favorites"
          label="Favorites"
          handleRefresh={handleRefresh}
        >
          <FavIcon />
        </IconWrapper>
      </div>
      <div className="navBarUserBox flexBox">
        <div
          className="userProfileCard flexBox"
          onClick={() => {
            navigate(`/profile/${uid}`);
          }}
        >
          <img
            src={profilePic || "/Images/userProfile_icon.png"}
            alt="Profile"
          />
          <p>{first_name}</p>
        </div>
        <IconWrapperCircle
          label="Create"
          icon={<CreateIcon onClick={togglePostModal} />}
        ></IconWrapperCircle>
        <IconWrapperCircle
          path="/messenger/new"
          label="Messenger"
          icon={<MessageIcon onClick={() => setMessageCount(0)} />}
          number={messageCount ? 1 : 0}
        ></IconWrapperCircle>
        <IconWrapperCircle
          childVisibility={notification}
          label="Notifications"
          icon={<NotificationIcon onClick={handleNotificationVisibility} />}
          number={notifications.filter((item) => !item.isRead)?.length}
        >
          {notification && (
            <Notifications notifications={notifications} uid={uid} />
          )}
        </IconWrapperCircle>
        <IconWrapperCircle
          childVisibility={account}
          label="Account"
          icon={<DownArrowIcon onClick={handleAccountVisibility} />}
        >
          {account && <AccountMenu />}
        </IconWrapperCircle>
      </div>
      {postModal && <NewPostModal togglePostModal={togglePostModal} />}
    </div>
  );
}

export default NavBar;
