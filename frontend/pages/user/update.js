import Link from "next/link";
import Private from "../../components/auth/Private";
import Layout from "../../components/Layout";
import UpdateProfile from "../../components/auth/UpdateProfile";

const UserProfileUpdate = () => {
  return (
    <Layout>
      <Private>
        <div className='container-fluid'>
          <div className='row'>
            <UpdateProfile />
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserProfileUpdate;
