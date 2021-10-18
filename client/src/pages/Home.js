import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
const { FETCH_POSTS_QUERY } = require("../util/graphql");

function Home(props) {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  function deletePostCallback() {
    props.history.push("/");
  }

  if (data) {
    const posts = data.getPosts;
    return (
      <Grid columns={1}>
        <Grid.Row className="page-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}
          {loading ? (
            <h1>Loading posts..</h1>
          ) : (
            <Transition.Group>
              {posts &&
                posts.map((post) => (
                  <Grid.Column key={post.id} style={{ marginBottom: 24 }}>
                    <PostCard
                      deletePostCallback={deletePostCallback}
                      post={post}
                    />
                  </Grid.Column>
                ))}
            </Transition.Group>
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

export default Home;
