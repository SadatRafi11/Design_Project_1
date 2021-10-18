import React, { useContext, useRef, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Grid,
  Icon,
  Label,
  Image,
  Form,
} from "semantic-ui-react";
import moment from "moment";

import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      commentBody: comment,
    },
  });

  function deletePostCallback() {
    props.history.push("/");
  }

  if (data) {
    let postMarkup;
    if (!data.getPost) {
      postMarkup = <p>Loading...</p>;
    } else {
      const {
        id,
        postBody,
        createdAt,
        username,
        comments,
        likes,
        likeCount,
        commentCount,
      } = data.getPost;

      postMarkup = (
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <Image
                src="https://www.ubonac.com/wp-content/uploads/2014/09/whatever.png"
                size="small"
                float="right"
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{postBody}</Card.Description>
                </Card.Content>
                <hr />
                <Card.Content extra>
                  <LikeButton user={user} post={{ id, likeCount, likes }} />
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("comment on post")}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                  {user && user.username === username && (
                    <DeleteButton postId={id} callback={deletePostCallback} />
                  )}
                </Card.Content>
              </Card>
              {user && (
                <Card fluid>
                  <Card.Content>
                    <Form>
                      <div className="ui action input fluid">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          name="comment"
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                          ref={commentInputRef}
                        />
                        <button
                          type="submit"
                          className="ui button teal"
                          disabled={comment.trim() === ""}
                          onClick={submitComment}
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              {comments.map((comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.commentBody}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return postMarkup;
  } else {
    return (
      <div>
        <h1>Loading that post...</h1>
      </div>
    );
  }
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $commentBody: String!) {
    createComment(
      commentInput: { postId: $postId, commentBody: $commentBody }
    ) {
      id
      comments {
        id
        commentBody
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query Query($postId: ID!) {
    getPost(postId: $postId) {
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
        createdAt
        commentBody
      }
    }
  }
`;

export default SinglePost;
