import { CLEAR_POSTS, GET_NEW_POSTS, GET_POSTS } from "./actionTypes";

const init = {
  posts: [],
};

export const postsReducer = (state = init, { type, payload }) => {
  switch (type) {
    case GET_POSTS: {
      return {
        ...state,
        posts: payload,
      };
    }
    case GET_NEW_POSTS: {
      return {
        ...state,
        posts: [...state.posts, ...payload],
      };
    }
    case CLEAR_POSTS: {
      return {
        posts: [],
      };
    }
    default:
      return state;
  }
};
