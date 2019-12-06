import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";

import Layout from "../../components/Layout";
import { listBlogs } from "../../actions/blog";
import Card from "../../components/blog/Card";
import { DOMAIN, APP_NAME, FB_APP_ID } from "../../config";

const Blogs = ({
  blogs,
  categories,
  tags,
  totalBlogs,
  blogsLimit,
  blogSkip,
  router
}) => {
  const head = () => (
    <Head>
      <title>Programming Blogs | {APP_NAME} </title>
      <meta
        name='description'
        content='Programming blog and tutorials about React Node MongoDB next web development application app'
      />
      <link rel='canonical' href={`${DOMAIN}${router.pathname}`} />
      <meta
        property='og:title'
        content={`Latest web tutorials | ${APP_NAME}`}
      />
      <meta
        property='og:description'
        content='Programming blog and tutorials about React Node MongoDB next web development application app'
      />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={`${DOMAIN}${router.pathname}`} />
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

  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogs(toSkip, limit).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className='btn btn-outline-primary btn-lg'>
          Load More
        </button>
      )
    );
  };

  const showAllBlogs = () => {
    if (!blogs || blogs.length < 1) {
      return (
        <article>
          <p>There is no posts yet.</p>
        </article>
      );
    } else {
      return blogs.map((blog, i) => {
        // ()
        return (
          <article key={i}>
            <Card blog={blog} />
            <hr />
          </article>
        );
      });
    }
  };

  const showAllCategories = () => {
    if (categories) {
      return categories.map((c, i) => (
        <Link href={`/categories/${c.slug}`} key={i}>
          <a className='btn btn-primary mr-1 ml-1 mt-3'>{c.name}</a>
        </Link>
      ));
    }
  };

  const showAllTags = () => {
    if (tags) {
      return tags.map((t, i) => (
        <Link href={`/tags/${t.slug}`} key={i}>
          <a className='btn btn-outline-primary mr-1 ml-1 mt-3'>{t.name}</a>
        </Link>
      ));
    }
  };

  const showLoadedBlogs = () => {
    return loadedBlogs.map((b, i) => (
      <article key={i}>
        <Card blog={b} />
        <hr />
      </article>
    ));
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
                  Programming blogs and tutorials
                </h1>
              </div>
              <section>
                <div className='pb-5 text-center'>
                  {showAllCategories()}
                  <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className='container-fluid'>{showAllBlogs()}</div>
          <div className='container-fluid'>{showLoadedBlogs()}</div>
          <div className='text-center pt-5 pb-5'>{loadMoreButton()}</div>
        </main>
      </Layout>
    </>
  );
};

Blogs.getInitialProps = () => {
  let skip = 0;
  let limit = 2;
  return listBlogs(skip, limit).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        totalBlogs: data.size,
        blogsLimit: limit,
        blogSkip: skip
      };
    }
  });
};

export default withRouter(Blogs);
