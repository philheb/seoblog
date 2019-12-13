import Layout from "../../../components/Layout";
import CreateBlog from "../../../components/crud/CreateBlog";
import Private from "../../../components/auth/Private";

const Blog = () => {
  return (
    <Layout>
      <Private>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 pt-5 pb-5'>
              <h2>Create a new blog</h2>
            </div>
            <div className='col-md-12'>
              <CreateBlog />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default Blog;
