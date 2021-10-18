import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      postBody
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        commentBody
        createdAt
      }
    }
  }
`;
