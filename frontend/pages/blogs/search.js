import { listSearch } from "../../actions/blog";
import Card from "../../components/blog/Card";
import Layout from "../../components/Layout";

const Search = ({ blogs, search }) => {
  const showBlogs = () => {
    if (!blogs || blogs.length < 1) {
      return <p className='text-center mt-5'>We couldn't find any posts.</p>;
    }
    return blogs.map((blog, i) => {
      return (
        <article key={i}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };

  return (
    <Layout>
      <main>
        <div className='container-fluid'>
          <header>
            <div className='col-md-12 pt-3'>
              <h3 className='display-5 text-center'>
                Results for <span className='font-italic'>" {search} "</span>
              </h3>
              <p className='text-center'>We found {blogs.length} posts.</p>
              {showBlogs()}
            </div>
          </header>
        </div>
      </main>
    </Layout>
  );
};

Search.getInitialProps = ({ query }) => {
  return listSearch(query.search).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { blogs: data, search: query.search };
    }
  });
};

export default Search;
