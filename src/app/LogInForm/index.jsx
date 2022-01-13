import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import Message from '../../components/Message';
import TextInput from '../../components/TextInput';
import useForm from '../../hooks/useForm';

const Helper = styled.p`
  text-align: center;
  color: rgb(45, 51, 58);
  margin-bottom: 36px;
  font-size: 0.9rem;
`;

const StyledRouterLink = styled.p`
  text-align: center;
  color: rgb(45, 51, 58);
  margin-top: 24px;
  font-size: 0.9rem;
`;

const StyledLogInForm = styled.form`
`;

const FORM_FIELDS = [{
  key: 'email',
  label: 'Email',
  type: 'text',
  getErrorMessage: (data) => {
    if (!data.email) {
      return 'Please input your email';
    }

    return '';
  },
}, {
  key: 'password',
  label: 'Password',
  type: 'password',
  getErrorMessage: (data) => {
    if (!data.password) {
      return 'Please input your password';
    }

    return '';
  },
}];

const LogInForm = function LogInForm({
  user,
  setUser,
}) {
  const [serverResponse, setServerResponse] = useState();
  const [loading, setLoading] = useState();

  const {
    data,
    touched,
    validate,
    onChange,
    onBlur,
  } = useForm(FORM_FIELDS);

  if (user) {
    return (
      <Navigate replace to="/user/dashboard" />
    );
  }

  return (
    <div>
      <Logo>LOGO</Logo>
      <Helper>Log in to LOGO App!</Helper>
      <StyledLogInForm
        onSubmit={(event) => {
          event.preventDefault();

          if (!validate(data)) {
            return;
          }

          setLoading(true);

          axios.post('http://localhost:8000/auth/sign-in', {
            email: data.email,
            password: data.password,
          })
            .then((response) => {
              setServerResponse(response);
              setUser(response.data);

              localStorage.setItem('AUTH_TOKEN', response.headers['x-auth-token']);
            })
            .catch((error) => setServerResponse(error.response))
            .finally(() => setLoading(false));
        }}
      >
        {serverResponse && ({
          200: (
            <Message type="success">You are successfully logged in!</Message>
          ),
          404: (
            <Message type="error">Email and password does not match</Message>
          ),
        }[serverResponse.status])}
        {FORM_FIELDS.map((field) => (
          <TextInput
            key={field.key}
            label={field.label}
            type={field.type}
            error={touched[field.key] && field.getErrorMessage(data)}
            value={data[field.key]}
            onChange={onChange(field.key)}
            onBlur={onBlur(field.key)}
          />
        ))}
        <Button type="submit" disabled={!validate(data) || loading}>LOG IN</Button>
        <StyledRouterLink>
          Not a member yet? 
          <Link to="/auth/sign-up">  Sign Up</Link>
        </StyledRouterLink>
      </StyledLogInForm>
    </div>
  );
};

export default LogInForm;