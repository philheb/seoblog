import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import renderHTML from "react-render-html";
import { API } from "../../config";
import { getPublicProfile } from "../../actions/user";

const CardNew = ({ blog }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const showCategories = blog =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className='btn btn-sm btn-primary mr-1 mt-3'>{c.name}</a>
      </Link>
    ));

  const showTags = blog =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className='btn btn-sm btn-outline-primary mr-1 ml-1 mt-3'>
          {t.name}
        </a>
      </Link>
    ));

  useEffect(() => {
    getUserProfileImage();
  }, []);

  const getUserProfileImage = () => {
    getPublicProfile(blog.postedBy.username).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setAvatarUrl(data.user.imageUrl);
      }
    });
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='card card-body shadow p-3 mb-5 bg-white rounded'>
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
          <div className='row'>
            <div className='col-md-12'>
              <Link href={`/blogs/${blog.slug}`}>
                <img
                  src={`${API}/blog/image/${blog.slug}`}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    cursor: "pointer"
                  }}
                ></img>
              </Link>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <Link href={`/blogs/${blog.slug}`}>
                <a>
                  <h3 className='mt-5'>{blog.title}</h3>
                </a>
              </Link>
              <h4 className='mt-3 text-muted'>{renderHTML(blog.excerpt)}</h4>
              <div className='row'>
                <div className='col-12'>
                  <Link href={`/blogs/${blog.slug}`}>
                    <a>
                      <small className='text-muted'>Read more...</small>
                    </a>
                  </Link>
                </div>
                <div className='col-12'>
                  {showCategories(blog)}
                  {showTags(blog)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNew;
