import { useEffect } from "react";
import Router from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";
import { isAuth } from "../actions/auth";

const Index = () => {
  // useEffect(() => {
  //   if (isAuth()) {
  //     Router.replace("/blogs");
  //   }
  // }, []);
  return (
    <Layout>
      <div className='landing'>
        <div className='dark-overlay landing-inner text-light'>
          <div className='container-fluid' style={{ height: "100%" }}>
            <div className='row align-items-center' style={{ height: "100%" }}>
              <div className='col-md-12 text-center'>
                <h4 className='display-4 mb-4'>PROGRAMMING BLOG & TUTORIALS</h4>
                <p className='lead'>
                  {" "}
                  Best programming and web development blogs and tutorials on
                  React Node NextJs and JavaScript.
                </p>
                <hr />
                <div className='landing-buttons'>
                  {isAuth() && (
                    <Link href='/signup'>
                      <a className='btn btn-primary btn-lg btn-block text-light mb-2'>
                        See the Posts
                      </a>
                    </Link>
                  )}

                  {!isAuth() && (
                    <div>
                      <Link href='/signup'>
                        <a className='btn btn-primary btn-lg btn-block text-light mb-2'>
                          Sign Up
                        </a>
                      </Link>
                      <Link href='/signin'>
                        <a className='btn btn-outline-info btn-lg btn-block text-light'>
                          Log In
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>
        {`
          .landing {
            position: relative;
            height: 100vh;
            margin-top: -50px;
            margin-bottom: -50px;
            background-image: url("/static/images/home.jpg");
            background-size: cover;
          }
          .landing-inner {
            padding-top: 80px;
          }
          .landing-buttons {
            width: 40%;
            margin: 0 auto;
          }
          .dark-overlay {
            background-color: rgba(0, 0, 0, 0.4);
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          @media only screen and (min-width: 800px) {
            .landing-inner {
              padding-top: 0px;
            }
            .dark-overlay {
              background-color: rgba(0, 0, 0, 0.6);
              position: relative;
              top: 12.5%;
              left: 12.5%;
              width: 80%;
              height: 75%;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default Index;
