import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
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
          label="Username"
          placeholder="Username"
          name="username"
          type="text"
          required
          value={values.username}
          error={errors.username ? true : false}
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

        <Form.Input
          label="Confirm Password"
          placeholder="ConfirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        ></Form.Input>

        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $email: String!
    $username: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        email: $email
        username: $username
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      token
      createdAt
    }
  }
`;

export default Register;
