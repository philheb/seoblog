import { useState } from "react";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { resetPassword } from "../../../../actions/auth";

const ResetPassword = ({ router }) => {
  const [values, setValues] = useState({
    newPassword: "",
    message: "",
    error: "",
    showForm: true,
    isLoading: false
  });

  const { newPassword, message, error, showForm, isLoading } = values;

  const onSubmitHandler = e => {
    e.preventDefault();
    console.log(router.query.id);
    setValues({ ...values, isLoading: true });
    resetPassword({
      newPassword,
      resetPasswordLink: router.query.id
    }).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          newPassword: "",
          isLoading: false
        });
      } else {
        setValues({
          ...values,
          message: data.message,
          error: "",
          showForm: false,
          newPassword: "",
          isLoading: false
        });
      }
    });
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

  const passwordResetForm = () => {
    return (
      <div className='mt-4'>
        <form
          onSubmit={onSubmitHandler}
          className='mt-4'
          style={{ maxWidth: "400px" }}
        >
          <div className='form-group'>
            <label>New Password</label>
            <input
              onChange={e =>
                setValues({ ...values, newPassword: e.target.value })
              }
              value={newPassword}
              type='password'
              className='form-control'
              placeholder='Type your new password.'
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
        <h2>Change your password.</h2>

        <hr />
        {showError()}
        {showMessage()}
        {showForm && passwordResetForm()}
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
