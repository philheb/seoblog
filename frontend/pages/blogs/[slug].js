import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import moment from "moment";
import renderHTML from "react-render-html";
import { withRouter } from "next/router";

import Layout from "../../components/Layout";
import SmallCard from "../../components/blog/SmallCard";
import { singleBlog, listRelated } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import DisqusThread from "../../components/DisqusThread";

const SingleBlog = ({ blog, query }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    loadRelated();
  }, []);

  const loadRelated = () => {
    listRelated({ blog }).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}{" "}
      </title>
      <meta name='description' content={blog.mdesc} />
      <link rel='canonical' href={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property='og:title' content={`${blog.title} | ${APP_NAME}`} />
      <meta property='og:description' content={blog.mdesc} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property='og:site_name' content={APP_NAME} />
      <meta property='og:image' content={`${API}/blog/images/${query.slug}`} />
      <meta
        property='og:image:secure_url'
        content={`${API}/blog/image/${blog.slug}`}
      />
      <meta property='og:image:type' content='image/jpeg' />
      <meta property='fb:app_id' content={`${FB_APP_ID}`} />
    </Head>
  );

  const showCategories = blog =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className='btn btn-primary mr-1 ml-1 mt-3'>{c.name}</a>
      </Link>
    ));

  const showTags = blog =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className='btn btn-outline-primary mr-1 ml-1 mt-3'>{t.name}</a>
      </Link>
    ));

  const showRelatedBlogs = () => {
    return related.map((blog, i) => (
      <div className='col-lg-4' key={i}>
        <article>
          <SmallCard blog={blog} />
        </article>
      </div>
    ));
  };

  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={blog.id}
          title={blog.title}
          path={`/blogs/${blog.slug}`}
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <article>
            <div className='container-fluid'>
              <section>
                <div className='row' style={{ marginTop: "-30px" }}>
                  <img
                    className='img img-fluid featured-image'
                    src={`${API}/blog/image/${blog.slug}`}
                    alt={blog.title}
                  />
                </div>
              </section>
              <section>
                <div className='container'>
                  <h1 className='display-2 pb-3 pt-3 font-weight-bold text-center'>
                    {blog.title}
                  </h1>
                  <p className='lead mt-3 mark'>
                    Written by{" "}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                      <a>{blog.postedBy.username}</a>
                    </Link>{" "}
                    | Published {moment(blog.updatedAt).fromNow()}
                  </p>
                  <div className='pb-3'>
                    {showCategories(blog)}
                    {showTags(blog)}
                  </div>
                </div>
              </section>
            </div>
            <div className='container'>
              <section>
                <div className='col-md-12 lead'>{renderHTML(blog.body)}</div>
              </section>
            </div>
            <div className='container pb-5'>
              <h4 className='text-center pt-5 pb-5 h2'>Related Blog</h4>
              <hr />
              <div className='row'>{showRelatedBlogs()}</div>
            </div>
            <div className='container pb-5'>{showComments()}</div>
          </article>
        </main>
      </Layout>
    </React.Fragment>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { blog: data, query };
    }
  });
};

export default withRouter(SingleBlog);
