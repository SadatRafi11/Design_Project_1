import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    postBody: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.postBody = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field style={{ marginBottom: 24 }}>
          <Form.Input
            placeholder="Share your work!"
            name="postBody"
            onChange={onChange}
            value={values.postBody}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($postBody: String!) {
    createPost(postBody: $postBody) {
      id
      postBody
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        commentBody
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
