import Link from "next/link";
import moment from "moment";
import renderHTML from "react-render-html";
import { API } from "../../config";

const CardNew = ({ blog }) => {
  // const showCategories = blog =>
  //   blog.categories.map((c, i) => (
  //     <Link key={i} href={`/categories/${c.slug}`}>
  //       <a className='btn btn-primary mr-1 ml-1 mt-3'>{c.name}</a>
  //     </Link>
  //   ));
  const showCategories = blog => {
    console.log(blog);
  };

  // const showTags = blog =>
  //   blog.tags.map((t, i) => (
  //     <Link key={i} href={`/tags/${t.slug}`}>
  //       <a className='btn btn-outline-primary mr-1 ml-1 mt-3'>{t.name}</a>
  //     </Link>
  //   ));

  return (
    <div className='container'>
      <div className='row'>
        <div className='card card-body shadow p-3 mb-5 bg-white rounded'>
          <div
            className='row mb-3'
            style={{ padding: "0 15px 0 15px", maxHeight: "50px" }}
          >
            <div className=''>
              <img
                src='/static/images/phil.jpg'
                className='rounded-circle shadow'
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover"
                }}
              ></img>
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
              <img
                src={`${API}/blog/image/${blog.slug}`}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover"
                }}
              ></img>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <h3 className='mt-5'>You Don’t Need Loops in JavaScript.</h3>
              <h4 className='mt-3 text-muted'>
                Learn how to remove loops and use higher-order functions like
                map, reduce, and filter.
              </h4>
              <a href='#'>
                <small className='text-muted'>Read more...</small>
              </a>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              {showCategories()}
              {/* {showTags()} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardNew;
