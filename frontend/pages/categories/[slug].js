import Head from "next/head";

import Layout from "../../components/Layout";
import { getCategory } from "../../actions/category";
import { DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import Card from "../../components/blog/Card";

const Category = ({ category, blogs, query }) => {
  const head = () => (
    <Head>
      <title>
        {category.name} | {APP_NAME}{" "}
      </title>
      <meta
        name='description'
        content={`Best programming blog and tutorials about ${category.name}`}
      />
      <link rel='canonical' href={`${DOMAIN}/categories/${query.slug}`} />
      <meta property='og:title' content={`${category.name} | ${APP_NAME}`} />
      <meta
        property='og:description'
        content={`Best programming blog and tutorials about ${category.name}`}
      />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={`${DOMAIN}/categories/${query.slug}`} />
      <meta property='og:site_name' content={APP_NAME} />
      <meta
        property='og:image'
        content={`${DOMAIN}/static/images/seoblog.jpeg`}
      />
      <meta
        property='og:image:secure_url'
        content={`${DOMAIN}/static/images/seoblog.jpeg`}
      />
      <meta property='og:image:type' content='image/jpeg' />
      <meta property='fb:app_id' content={`${FB_APP_ID}`} />
    </Head>
  );
  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      // ()
      return (
        <article key={i}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className='container-fluid'>
            <header>
              <div className='col-md-12 pt-3'>
                <h1 className='display-4 font-weight-bold text-center'>
                  {category.name}
                </h1>
                {showAllBlogs()}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </>
  );
};

Category.getInitialProps = ({ query }) => {
  return getCategory(query.slug).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { category: data.category, blogs: data.blogs, query };
    }
  });
};

export default Category;
