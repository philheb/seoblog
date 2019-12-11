import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import moment from "moment";
import { isAuth } from "../../actions/auth";

import { withRouter } from "next/router";

import Layout from "../../components/Layout";
import { getPublicProfile } from "../../actions/user";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import ContactForm from "../../components/ContactForm";

const UserProfile = ({ user, blogs, size, query }) => {
  const head = () => (
    <Head>
      <title>
        {`Posts by ${user.username}`} | {APP_NAME}
      </title>
      <meta name='description' content={`Posts by ${user.username}`} />
      <link rel='canonical' href={`${DOMAIN}/profile/${query.username}`} />
      <meta property='og:title' content={`${user.username} | ${APP_NAME}`} />
      <meta property='og:description' content={`Posts by ${user.username}`} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={`${DOMAIN}/profile/${query.username}`} />
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
  const showUserPosts = () => {
    return blogs.map((blog, i) => {
      return (
        <div className='mb-4' key={i}>
          <Link href={`/blogs/${blog.slug}`}>
            <a>{blog.title}</a>
          </Link>
        </div>
      );
    });
  };
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-body'>
                  <div className='row'>
                    <div className='col-sm-8'>
                      <h2>{user.name}</h2>
                      <p className='text-muted'>
                        Joined {moment(user.createdAt).fromNow()}
                      </p>
                      <p>{user.about}</p>
                      {isAuth() &&
                        isAuth().username &&
                        isAuth().username === user.username && (
                          <Link href='/user/update'>
                            <button className='btn btn-sm mb-4 btn-outline-primary'>
                              Edit Profile
                            </button>
                          </Link>
                        )}
                    </div>
                    <div className='col-sm-4'>
                      <img
                        src={user.imageUrl}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "auto",
                          borderStyle: "solid",
                          borderWidth: " 0 2px 0 2px",
                          borderColor: "#007bff"
                        }}
                        alt='user profile'
                        className='img img-fluid mb-3 rounded-circle'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className='container pb-5'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='card'>
                <h5 className='card-title bg-primary text-light p-4'>
                  Recent blog posts
                </h5>
                <div className='card-body'>{showUserPosts()}</div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='card'>
                <h5 className='card-title bg-primary text-light p-4'>
                  Message {user.name}
                </h5>
                <div className='card-body'>
                  <ContactForm authorEmail={user.email} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
};

UserProfile.getInitialProps = ({ query }) => {
  return getPublicProfile(query.username).then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { user: data.user, blogs: data.blogs, size: data.size, query };
    }
  });
};

export default UserProfile;
