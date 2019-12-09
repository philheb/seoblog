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
    <div>
      <div className='row'>
        <div className='col-2'>
          <Link href={`/profile/${blog.postedBy.username}`}>
            <img
              src={avatarUrl}
              className='rounded-circle shadow'
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                cursor: "pointer"
              }}
            ></img>
          </Link>
        </div>
        <div className='col-10'>
          <div>
            <Link href={`/blogs/${blog.slug}`}>
              <a>
                <p className='card-title'>{blog.title}</p>
              </a>
            </Link>
          </div>
          <div>
            <small style={{ marginBottom: "2px" }}>
              <Link href={`/profile/${blog.postedBy.username}`}>
                <a>{blog.postedBy.name}</a>
              </Link>{" "}
            </small>
          </div>
          <div>
            <small className='text-muted' style={{ marginBottom: "0px" }}>
              {moment(blog.updatedAt).format("MMM DD")} - 5 min read ★
            </small>
          </div>
        </div>
      </div>

      <div className='row' style={{ margin: "0 20px 20px 20px" }}>
        <div className='col'></div>
      </div>
    </div>
  );
};

export default SmallCard;
