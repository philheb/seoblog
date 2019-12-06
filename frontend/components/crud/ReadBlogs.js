import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import moment from "moment";
import renderHTML from "react-render-html";
import { API } from "../../config";

import { getCookie, isAuth } from "../../actions/auth";
import { list, removeBlog, updateBlog } from "../../actions/blog";
import Card from "../blog/Card";

const ReadBlogs = ({ username }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    list(username).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const confirmDelete = (slug, title) => {
    let answer = window.confirm(
      `Do you really want to delete the "${title}" post?`
    );
    if (answer) {
      deleteBlog(slug);
    }
  };

  const deleteBlog = slug => {
    removeBlog(slug, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    });
  };

  const showUpdateButton = blog => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/${blog.slug}`}>
          <a className='btn btn-sm btn-warning'>Update</a>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className='btn btn-sm btn-warning'>Update</a>
        </Link>
      );
    }
  };

  const showAllBlogs = () => {
    if (!blogs || blogs.length < 1) {
      return <p>You don't have any posts yet</p>;
    }
    return blogs.map((blog, i) => {
      return (
        <div key={i} className='lead pb-5'>
          <header>
            <Link href={`/blogs/${blog.slug}`}>
              <a className='text-dark'>
                <h2 className='font-weight-bold pt-3 pb-3'>{blog.title}</h2>
              </a>
            </Link>
          </header>
          <section>
            <p className='mark ml-1 pt-2 pb-2'>
              Written by {blog.postedBy.name} | Published{" "}
              {moment(blog.updatedAt).fromNow()}
            </p>
          </section>
          <div className='row'>
            <div className='col-md-12'>
              <section>
                <div className='pb-3'>{renderHTML(blog.excerpt)}</div>

                <button
                  className='btn btn-sm btn-danger mr-2'
                  onClick={() => confirmDelete(blog.slug, blog.title)}
                >
                  Delete
                </button>
                {showUpdateButton(blog)}
              </section>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {message && <div className='alert alert-warning'>{message}</div>}
      {showAllBlogs()}
    </div>
  );
};

export default ReadBlogs;
