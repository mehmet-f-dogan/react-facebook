import React from "react";
import NavBar from "../Components/NavBar/NavBar";
import { Route, Routes } from "react-router-dom";
import Home from "../Components/Pages/Home";
import LoginPage from "../Components/Login/LoginPage";
import UserProfileRouter from "./UserProfileRouter";
import Chats from "../Components/Chats/Chats";
import SideBar from "../Components/SideBar/SideBar";
import Messenger from "../Components/Messenger/Messenger";
import { useSelector } from "react-redux";
import Videos from "../Components/Pages/Videos";
import Favorites from "../Components/Pages/Favorites";
import PageNotFound from "../Components/Pages/PageNotFound";
import useVisibility from "../Hooks/useVisibility";

function Router({ getNextPost, limit }) {
  const [refresh, setRefresh] = React.useState(true);
  const [newChatBox, toggleNewChatBox] = useVisibility();

  const handleRefresh = () => {
    setRefresh(!refresh);
  };
  const isAuth = useSelector((store) => store.auth.isAuth);

  return !isAuth ? (
    <LoginPage />
  ) : (
    <>
      <NavBar refresh={refresh} handleRefresh={handleRefresh} />
      <Routes>
        <Route
          path="/friends/:profileId"
          element={
            <UserProfileRouter
              path="/friends"
              refresh={refresh}
              forceRefresh={handleRefresh}
            />
          }
        ></Route>
        <Route
          path="/profile/:userId"
          element={
            <UserProfileRouter
              path="/profile"
              refresh={refresh}
              forceRefresh={handleRefresh}
            />
          }
        ></Route>
        <Route
          path="/messenger/:chatID"
          element={<Messenger handleRefresh={handleRefresh} />}
        ></Route>
        <Route
          path="*"
          element={
            <>
              <Chats
                newChatBox={newChatBox}
                toggleNewChatBox={toggleNewChatBox}
              />
              <Routes>
                <Route
                  path="/"
                  exact
                  element={
                    <Home
                      toggleNewChatBox={toggleNewChatBox}
                      handleRefresh={handleRefresh}
                      getNextPost={getNextPost}
                      limit={limit}
                    />
                  }
                ></Route>
                <Route
                  path="/videos"
                  exact
                  element={<Videos handleRefresh={handleRefresh} />}
                ></Route>
                <Route
                  path="/favorites"
                  exact
                  element={<Favorites handleRefresh={handleRefresh} />}
                ></Route>
                <Route path="/menu" exact element={<SideBar />}></Route>
                <Route element={<PageNotFound />}></Route>
              </Routes>
            </>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default Router;
