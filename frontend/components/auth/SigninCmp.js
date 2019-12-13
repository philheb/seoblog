import { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";

import { signinAction, authenticate, isAuth } from "../../actions/auth";
import GoogleLogin from "./GoogleLogin";

const SigninCmp = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true
  });

  const { email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push("/blogs");
  }, []);

  const submitHandler = e => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { email, password };
    signinAction(user).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          if (isAuth() && isAuth().role === 1) {
            Router.push("/blogs");
          } else {
            Router.push("/blogs");
          }
        });
      }
    });
  };

  const changeHandler = input => e => {
    setValues({ ...values, error: false, [input]: e.target.value });
  };

  const showLoading = () => {
    return loading ? <div className='alert alert-primary'>Loading...</div> : "";
  };

  const showError = () => {
    return error ? <div className='alert alert-danger'>{error}</div> : "";
  };

  const showMessage = () => {
    return message ? <div className='alert alert-success'>{message}</div> : "";
  };

  const signinForm = () => {
    return (
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <input
            onChange={changeHandler("email")}
            type='email'
            className='form-control'
            placeholder='Email'
            value={email}
          />
        </div>
        <div className='form-group'>
          <input
            onChange={changeHandler("password")}
            type='password'
            className='form-control'
            placeholder='Password'
            value={password}
          />
        </div>
        <div>
          <button className='btn btn-primary'>Sign In</button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      {showError()}
      {showMessage()}
      {showLoading()}
      <GoogleLogin />
      {showForm && signinForm()}
      <hr />
      <Link href='/auth/password/forgot'>
        <a className='btn btn-sm btn-outline-danger'>Forgot your password?</a>
      </Link>
    </React.Fragment>
  );
};

export default SigninCmp;
