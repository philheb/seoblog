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
import { getPublicProfile } from "../../actions/user";

const SingleBlog = ({ blog, query }) => {
  const [related, setRelated] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    listRelated({ blog }).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
    getPublicProfile(blog.postedBy.username).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setAvatarUrl(data.user.imageUrl);
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
        <a className='btn btn-sm btn-primary mr-1 ml-1 mt-3'>{c.name}</a>
      </Link>
    ));

  const showTags = blog =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className='btn btn-outline-primary btn-sm mr-1 ml-1 mt-3'>
          {t.name}
        </a>
      </Link>
    ));

  const showRelatedBlogs = () => {
    return related.map((blog, i) => (
      <div className='col-lg-4' key={i}>
        <SmallCard blog={blog} />
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
              <section style={{ marginBottom: "50px" }}>
                <div className='row' style={{ marginTop: "-50px" }}>
                  <img
                    className='img img-fluid featured-image'
                    src={`${API}/blog/image/${blog.slug}`}
                    alt={blog.title}
                  />
                </div>
              </section>
              <section>
                <div className='container'>
                  <h1 className=' pb-3 pt-3'>{blog.title}</h1>
                  <div
                    className='row mb-3'
                    style={{ padding: "0 15px 0 15px", maxHeight: "50px" }}
                  >
                    <div className=''>
                      <Link href={`/profile/${blog.postedBy.username}`}>
                        <img
                          src={avatarUrl}
                          className='rounded-circle shadow'
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            cursor: "pointer"
                          }}
                        ></img>
                      </Link>
                    </div>
                    <div className='col'>
                      <p style={{ marginBottom: "2px" }}>
                        <Link href={`/profile/${blog.postedBy.username}`}>
                          <a>{blog.postedBy.name}</a>
                        </Link>{" "}
                      </p>
                      <p className='text-muted' style={{ marginBottom: "0px" }}>
                        {moment(blog.updatedAt).format("MMM DD")} - 5 min read ★
                      </p>
                    </div>
                  </div>
                  <div className='pb-3'>
                    {showCategories(blog)}
                    {showTags(blog)}
                  </div>
                </div>
              </section>
            </div>
            <div className='container'>
              <section>
                <div className='lead mt-4'>{renderHTML(blog.body)}</div>
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
