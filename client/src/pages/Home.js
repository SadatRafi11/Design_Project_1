import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";

function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  if (data) {
    const posts = data.getPosts;
    return (
      <Grid columns={1}>
        <Grid.Row className="page-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {loading ? (
            <h1>Loading posts..</h1>
          ) : (
            posts &&
            posts.map((post) => (
              <Grid.Column key={post.id} style={{ marginBottom: 24 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))
          )}
        </Grid.Row>
      </Grid>
    );
  } else {
    return (
      <div>
        <h1>Loading posts...</h1>
      </div>
    );
  }
}

const FETCH_POSTS_QUERY = gql`
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

export default Home;
