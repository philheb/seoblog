import Layout from "../components/Layout";
import SignupCmp from "../components/auth/SignupCmp";
import Link from "next/link";

const Signup = () => {
  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">Sign Up</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SignupCmp />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
