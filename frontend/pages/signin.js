import Layout from "../components/Layout";
import SigninCmp from "../components/auth/SigninCmp";
import { withRouter } from "next/router";

const Signin = ({ router }) => {
  const showRedirectMessage = () => {
    if (router.query.message) {
      return <div className='alert alert-danger'>{router.query.message}</div>;
    }
    return;
  };
  return (
    <Layout>
      <div className='container'>
        <h2 className='text-center pt-4 pb-4'>Sign In</h2>
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            {showRedirectMessage()}
            <SigninCmp />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Signin);
