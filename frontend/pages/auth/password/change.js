import { useState } from "react";
import Link from "next/link";

import Private from "../../../components/auth/Private";
import Layout from "../../../components/Layout";
import { getCookie, changePassword } from "../../../actions/auth";

const ChangePassword = () => {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    success: "",
    error: "",
    isLoading: false
  });

  const { currentPassword, newPassword, success, error, isLoading } = values;

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const token = getCookie("token");

  const handleChange = name => e => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: "",
      success: ""
    });
  };

  const toggleCurrent = e => {
    e.preventDefault;
    setShowCurrent(!showCurrent);
  };

  const toggleNew = e => {
    e.preventDefault;
    setShowNew(!showNew);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, isLoading: true });
    const user = { currentPassword, newPassword };
    changePassword(token, user).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          isLoading: false
        });
      } else {
        setValues({
          ...values,
          success: data.message,
          isLoading: false
        });
      }
    });
  };

  const showError = () => (
    <div
      className='alert alert-danger'
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className='alert alert-success'
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const showLoading = () => (
    <div
      className='alert alert-info'
      style={{ display: isLoading ? "" : "none" }}
    >
      <p>Loading...</p>
    </div>
  );

  return (
    <Layout>
      <div className='container'>
        <div className='col-md-6 offset-md-3'>
          <h2 className='pb-4'>Change your password.</h2>
          {showSuccess()}
          {showError()}
          {showLoading()}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <div className='input-group mb-3'>
                <input
                  onChange={handleChange("currentPassword")}
                  type={showCurrent ? "text" : "password"}
                  className='form-control'
                  placeholder='Current password'
                  value={currentPassword}
                />
                <div className='input-group-append'>
                  <button
                    type='button'
                    onClick={toggleCurrent}
                    className='btn btn-outline-secondary'
                    style={{
                      fontFamily: "Avenir, Arial, FontAwesome"
                    }}
                  >
                    &#xF06e;
                  </button>
                </div>
              </div>
            </div>
            <div className='form-group'>
              <div className='input-group mb-3'>
                <input
                  onChange={handleChange("newPassword")}
                  type={showNew ? "text" : "password"}
                  className='form-control'
                  placeholder='New password'
                  value={newPassword}
                />
                <div className='input-group-append'>
                  <button
                    type='button'
                    onClick={toggleNew}
                    className='btn btn-outline-secondary'
                    style={{
                      fontFamily: "Avenir, Arial, FontAwesome"
                    }}
                  >
                    &#xF06e;
                  </button>
                </div>
              </div>
            </div>
            <button type='submit' className='btn btn-primary'>
              Change
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;
