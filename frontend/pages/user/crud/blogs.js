import Layout from "../../../components/Layout";
import ReadBlogs from "../../../components/crud/ReadBlogs";
import Private from "../../../components/auth/Private";
import { isAuth } from "../../../actions/auth";

const Blogs = () => {
  const username = isAuth() && isAuth().username;
  return (
    <Layout>
      <Private>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12 pt-5 pb-5'>
              <h2>Manage blogs</h2>
            </div>
            <div className='col-md-12'>
              <ReadBlogs username={username} />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default Blogs;
