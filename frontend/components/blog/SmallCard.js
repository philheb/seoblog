import { useState, useEffect } from "react";
import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import { API } from "../../config";
import { getPublicProfile } from "../../actions/user";

const SmallCard = ({ blog }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
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
    <div className='card mb-5' style={{ height: "550px" }}>
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <img
              className='img img-fluid'
              style={{ height: "200px", width: "100%", objectFit: "cover" }}
              src={`${API}/blog/image/${blog.slug}`}
              alt={blog.title}
            />
          </a>
        </Link>
      </section>

      <div className='card-body'>
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <a>
              <h5 className='card-title'>{blog.title}</h5>
            </a>
          </Link>
          <div className='card-text'>{renderHTML(blog.excerpt)}</div>
        </section>
      </div>

      {/* <div className='card-body'>
        Posted {moment(blog.updatedAt).fromNow()} by{" "}
        <Link href={`/profile/${blog.postedBy.username}`}>
          <a>{blog.postedBy.username}</a>
        </Link>
      </div> */}

      <div className='row' style={{ margin: "0 20px 20px 20px" }}>
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
    </div>
  );
};

export default SmallCard;
