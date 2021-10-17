import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";

function Login(props) {
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUser, {
    email: "",
    password: "",
  });

  const [login, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUser() {
    login();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          required
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        ></Form.Input>

        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          required
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        ></Form.Input>

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      id
      email
      username
      token
      createdAt
    }
  }
`;

export default Login;
