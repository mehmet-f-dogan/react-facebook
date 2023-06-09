import React from "react";
import PostCardFooter from "./PostCardFooter";
import PostCardHead from "./PostCardHead";
import { ReactComponent as LikeEmoji } from "../../Icons/likeEmoji.svg";
import PostCardComment from "./PostCardComment";
import { database, storage } from "../../Firebase/firebase";
import { useSelector } from "react-redux";
import PostModal from "../PostModal/PostModal";
import PostCardSkeleton from "./Skeleton/PostCardSkeleton";
import useVisibility from "../../Hooks/useVisibility";
import LikeToolTip from "./LikeToolTip";

function PostCard({
  title,
  image,
  videoPath,
  imagePath,
  id,
  author,
  activePostId,
  setActivePostId,
  time,
  video,
  activity,
  thumb_url,
}) {
  const [commentSection, toggleCommentSection] = useVisibility();
  const [postModal, togglePostModal] = useVisibility();
  const [likes, setLikes] = React.useState([]);
  const [comments, setComments] = React.useState([]);
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [likeShow, setLikeShow] = React.useState(false);
  const { uid } = useSelector((store) => store.auth.user);

  const handleEditPost = (editTitle) => {
    const payload = {
      title: editTitle,
    };
    database.collection("posts").doc(id).update(payload);
  };

  const handleSetProfilePic = () => {
    if (thumb_url) {
      const payload = {
        image,
        thumb_url,
        activity: `changed his profile picture.`,
        author: uid,
        time: new Date(),
      };

      database.collection("posts").add(payload);
      database.collection("users").doc(uid).update({ profilePic: thumb_url });
    }
  };
  const handleFav = () => {
    database
      .collection("users")
      .doc(uid)
      .collection("favorites")
      .doc(id)
      .set({ postId: id, time: new Date() });
  };

  const handleRemoveFav = (id) => {
    database
      .collection("users")
      .doc(uid)
      .collection("favorites")
      .doc(id)
      .delete();
  };

  const handleDeletePost = () => {
    database.collection("posts").doc(id).delete();
    if (imagePath) {
      storage.ref("postImages").child(imagePath).delete();
    }
    if (videoPath) {
      storage.ref("postVideos").child(videoPath).delete();
    }
  };

  const handleShare = (title) => {
    let payload = {
      originalAuthor: author,
      author: uid,
      activity: `shared ${userData.first_name} ${userData.last_name}'s post.`,
      title: title || "",
      time: new Date(),
    };
    if (image) {
      payload.image = image;
      payload.thumb_url = thumb_url;
    } else if (video) {
      payload.video = video;
    }
    if (author === uid) {
      payload.activity = `shared his post.`;
    }
    database.collection("posts").add(payload);
  };

  const handleClosePostModal = () => {
    togglePostModal();
  };

  const handleLike = () => {
    const payload = {
      like: "like",
      time: new Date(),
      author: uid,
    };
    const notificationPayload = {
      author: uid,
      time: new Date(),
      action: "liked your post.",
      isRead: false,
      tag: "like",
    };

    database.collection("posts").doc(id).collection("likes").add(payload);
    if (uid !== userData.uid) {
      database
        .collection("users")
        .doc(userData.uid)
        .collection("notifications")
        .add(notificationPayload);
    }
  };

  const handleDeleteLike = () => {
    const deleteLike = likes.filter((item) => item.author === uid);
    database
      .collection("posts")
      .doc(id)
      .collection("likes")
      .doc(deleteLike[0].likeId)
      .delete();
  };

  React.useEffect(() => {
    const unsubscribe1 = database
      .collection("posts")
      .doc(id)
      .collection("likes")
      .onSnapshot((response) => {
        setLikes(
          response.docs.map((doc) => ({ likeId: doc.id, ...doc.data() }))
        );
      });

    const unsubscribe2 = database
      .collection("posts")
      .doc(id)
      .collection("comments")
      .orderBy("time", "asc")
      .onSnapshot((response) => {
        setComments(
          response.docs.map((doc) => ({ commentId: doc.id, ...doc.data() }))
        );
      });

    const unsubscribe3 = database
      .collection("users")
      .doc(author)
      .onSnapshot((doc) => {
        setUserData(doc.data());
      });
    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    };
  }, []);

  React.useEffect(() => {
    if (!image && userData) {
      setLoading(false);
    }
  }, [userData]);

  return (
    <>
      <div
        className="postCardContainer"
        style={{ display: loading || !userData ? "none" : "block" }}
        onClick={() => setActivePostId(id)}
        id={id}
      >
        <PostCardHead
          setActivePostId={setActivePostId}
          handleRemoveFav={handleRemoveFav}
          handleFav={handleFav}
          activePostId={activePostId}
          {...userData}
          postEditFunction={{
            handleEditPost,
            handleDeletePost,
            handleSetProfilePic,
          }}
          time={time}
          author={author}
          image={image}
          title={title}
          activity={activity}
          id={id}
        />
        {title && <div className="postCardTags">{title}</div>}
        {image && (
          <div onClick={togglePostModal} className="postCardImage">
            <img
              onLoad={() => setLoading(false)}
              src={
                image ||
                import.meta.env.VITE_PUBLIC_URL +
                  "/Images/facebook_login_logo.png"
              }
              alt="img"
            />
          </div>
        )}
        {video && (
          <div onClick={togglePostModal} className="postCardImage">
            <video
              width="100%"
              height="500"
              controls
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <source src={video} type="video/mp4" />
            </video>
          </div>
        )}
        <div className="postCardLike flexBox">
          <div
            className="flexBox likeToolTipContainer"
            onMouseEnter={() => setLikeShow(true)}
            onMouseLeave={() => setLikeShow(false)}
          >
            <LikeEmoji />
            <p>{likes.length}</p>
            {likeShow && likes.length > 0 && <LikeToolTip likes={likes} />}
          </div>
          <div className="flexBox">
            <p onClick={toggleCommentSection}>{comments.length} Comments</p>
          </div>
        </div>
        <PostCardFooter
          handleDeleteLike={handleDeleteLike}
          handleLike={handleLike}
          handleShare={handleShare}
          like={JSON.stringify(likes).includes(uid)}
          showComment={toggleCommentSection}
          author={author}
          {...userData}
          title={title}
          video={video}
          image={image}
        />
        {commentSection && (
          <PostCardComment
            setActivePostId={setActivePostId}
            activePostId={activePostId}
            postId={id}
            comments={comments}
            userData={userData}
          />
        )}
      </div>
      {postModal && (
        <PostModal
          handleShare={handleShare}
          handleFav={handleFav}
          handleRemoveFav={handleRemoveFav}
          handleClosePostModal={handleClosePostModal}
          uid={uid}
          image={image}
          video={video}
          author={author}
          time={time}
          userData={userData}
          activity={activity}
          id={id}
          likes={likes}
          comments={comments}
          title={title}
          handleLike={handleLike}
          handleDeleteLike={handleDeleteLike}
          showComment={toggleCommentSection}
          postEditFunction={{
            handleEditPost,
            handleDeletePost,
            handleSetProfilePic,
          }}
        />
      )}

      <div
        className="postCardContainer"
        style={{ display: loading || !userData ? "block" : "none" }}
      >
        <PostCardSkeleton />
      </div>
    </>
  );
}

export default PostCard;
