import Link from "next/link";
import moment from "moment";
import renderHTML from "react-render-html";
import { API } from "../../config";

const Card = ({ blog }) => {
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

  return (
    <div className='lead pb-4'>
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <h2 className='font-weight-bold pt-3 pb-3'>{blog.title}</h2>
          </a>
        </Link>
      </header>
      <section>
        <p className='mark ml-1 pt-2 pb-2'>
          Written by{" "}
          <Link href={`/profile/${blog.postedBy.username}`}>
            <a>{blog.postedBy.username}</a>
          </Link>{" "}
          | Published {moment(blog.updatedAt).fromNow()}
        </p>
      </section>
      <section className='mb-4'>
        {showCategories(blog)}
        {showTags(blog)}
      </section>
      <div className='row'>
        <div className='col-md-4'>
          <section className='mb-2'>
            <Link href={`/blogs/${blog.slug}`}>
              <img
                src={`${API}/blog/image/${blog.slug}`}
                alt={blog.title}
                className='img img-fluid'
                style={{
                  maxHeight: "200px",
                  width: "100%",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
              />
            </Link>
          </section>
        </div>
        <div className='col-md-8'>
          <section>
            <div className='pb-3'>{renderHTML(blog.excerpt)}</div>

            <Link href={`/blogs/${blog.slug}`}>
              <a className='btn btn-primary pt-2'>Read More</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;
