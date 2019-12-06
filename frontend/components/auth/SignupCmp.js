import { useState, useEffect } from "react";
import Router from "next/router";

import { isAuth, register } from "../../actions/auth";
import GoogleLogin from "./GoogleLogin";

const SignupCmp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true
  });

  const { name, email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push("/blogs");
  }, []);

  const submitHandler = e => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { name, email, password };
    register(user).then(res => {
      if (res.error) {
        setValues({ ...values, error: res.error, loading: false });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          loading: false,
          message: res.message,
          showForm: false
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

  const signupForm = () => {
    return (
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <input
            onChange={changeHandler("name")}
            type='text'
            className='form-control'
            placeholder='Name'
            value={name}
          />
        </div>
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
          <button className='btn btn-primary'>Sign Up</button>
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
      {showForm && signupForm()}
    </React.Fragment>
  );
};

export default SignupCmp;
