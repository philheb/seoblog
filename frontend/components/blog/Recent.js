import { useState, useEffect } from "react";
import { withRouter } from "next/router";
import { listRecent } from "../../actions/blog";
import XSmallCard from "./XSmallCard";

const Recent = () => {
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    listRecent().then(data => {
      if (data.error) {
        console.log(data.error);
      }
      setLoadedBlogs(data);
    });
  };

  const showBlogs = () => {
    if (!loadedBlogs || loadedBlogs.length < 1) {
      return (
        <article>
          <p>There is no posts yet.</p>
        </article>
      );
    } else {
      return loadedBlogs.map((blog, i) => {
        // ()
        return (
          <article key={i} className='pt-4'>
            <XSmallCard blog={blog} />
          </article>
        );
      });
    }
  };

  return (
    <div className='card shadow' style={{ backgroundColor: "#fafafa" }}>
      <header
        className='text-center text-light'
        style={{ width: "100%", height: "60px", backgroundColor: "#212529" }}
      >
        <h4 style={{ height: "100%", padding: "15px" }}>Recent posts</h4>
      </header>

      <div className='card-body'>
        <div className='card-text'>{showBlogs()}</div>
      </div>
    </div>
  );
};

export default Recent;
