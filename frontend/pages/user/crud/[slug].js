import Layout from "../../../components/Layout";
import UpdateBlog from "../../../components/crud/UpdateBlog";
import Private from "../../../components/auth/Private";

const Blog = () => {
  return (
    <Layout>
      <Private>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12 pt-5 pb-5'>
              <h2>Edit your blog</h2>
            </div>
            <div className='col-md-12'>
              <UpdateBlog />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default Blog;
