import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { forgotPassword } from "../../../actions/auth";

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: "",
    message: "",
    error: "",
    showForm: true,
    isLoading: false
  });

  const { email, message, error, showForm, isLoading } = values;

  const onChangeHandler = e => {
    setValues({
      ...values,
      email: e.target.value,
      error: "",
      message: ""
    });
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    setValues({ ...values, isLoading: true });
    forgotPassword({ email }).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, isLoading: false });
      } else {
        console.log(data);
        setValues({
          ...values,
          isLoading: false,
          message: data.message,
          email: "",
          showForm: false
        });
      }
    });
    setValues({ ...values, isLoading: false });
  };

  const showError = () => {
    if (error) {
      return <div className='alert alert-danger'>{error}</div>;
    }
    return;
  };

  const showMessage = () => {
    if (message) {
      return <div className='alert alert-success'>{message}</div>;
    }
  };

  const passwordForgotForm = () => {
    return (
      <div className='mt-4'>
        <h5>
          Enter your email address and we will send you a link to reset your
          password.
        </h5>
        <form
          onSubmit={onSubmitHandler}
          className='mt-4'
          style={{ maxWidth: "400px" }}
        >
          <div className='form-group'>
            <label>Email address</label>
            <input
              onChange={onChangeHandler}
              value={email}
              type='email'
              className='form-control'
              placeholder='name@example.com'
              required
            />
          </div>
          <button type='submit' className='btn btn-outline-primary mb-3'>
            Reset my password
          </button>
        </form>
      </div>
    );
  };

  return (
    <Layout>
      <div className='container' style={{ maxWidth: "800px" }}>
        <h2>Forgot your password?</h2>

        <hr />
        {showError()}
        {showMessage()}
        {showForm && passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
