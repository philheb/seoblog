import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../../components/Layout";
import Link from "next/link";
import { withRouter } from "next/router";
import { signupAction, isAuth } from "../../../../actions/auth";

const ActivateAccount = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    error: "",
    isLoading: false,
    success: false,
    showButton: true
  });

  const { name, token, error, isLoading, success, showButton } = values;

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, [router]);

  const onSubmitHandler = e => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    signupAction({ token }).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          isLoading: false,
          showButton: false
        });
      } else {
        setValues({
          ...values,
          success: true,
          isLoading: false,
          showButton: false
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

  const showSuccess = () => {
    if (success) {
      return (
        <div className='alert alert-success'>
          Your account has been activated. Please{" "}
          <Link href='/signin'>log in.</Link>
        </div>
      );
    }
  };

  const showLoading = () => {
    isLoading ? (
      <div className='container justify-content-center '>Loading</div>
    ) : (
      ""
    );
  };

  return (
    <Layout>
      <div className='container text-center'>
        <h3>Hello {name}! Click on the button to activate your account.</h3>
        {showLoading()}
        {showSuccess()}
        {showError()}
        {showButton && (
          <button
            onClick={onSubmitHandler}
            className='btn btn-lg btn-success mt-4'
          >
            Activate
          </button>
        )}
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
