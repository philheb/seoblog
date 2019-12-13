import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";

import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillFormats, QuillModules } from "../../helpers/quill";

const CreateBlog = ({ router }) => {
  const getBlogFromLS = () => {
    if (typeof window === "undefined") {
      return false;
    }
    if (localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);
  const [body, setBody] = useState(getBlogFromLS());
  const [values, setValues] = useState({
    title: "",
    error: "",
    sizeError: "",
    success: false,
    formData: "",
    hidePublishButton: false
  });
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    title,
    error,
    sizeError,
    success,
    formData,
    hidePublishButton
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

  const initCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((category, index) => (
        <li key={index} className='list-unstyled'>
          <input
            onChange={checkedCategoriesHandler(category._id)}
            type='checkbox'
            className='mr-2'
          />
          <label className='form-check-label'>{category.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((tag, index) => (
        <li key={index} className='list-unstyled'>
          <input
            onChange={checkedTagsHandler(tag._id)}
            type='checkbox'
            className='mr-2'
          />
          <label className='form-check-label'>{tag.name}</label>
        </li>
      ))
    );
  };

  const checkedCategoriesHandler = catId => () => {
    setValues({ ...values, error: "" });
    const catIndex = checkedCategories.indexOf(catId);
    const newCatArray = [...checkedCategories];
    if (catIndex === -1) {
      newCatArray.push(catId);
    } else {
      newCatArray.splice(catIndex, 1);
    }
    setCheckedCategories(newCatArray);
    formData.set("categories", newCatArray);
  };
  const checkedTagsHandler = tagId => () => {
    setValues({ ...values, error: "" });
    const tagIndex = checkedTags.indexOf(tagId);
    const newTagArray = [...checkedTags];
    if (tagIndex === -1) {
      newTagArray.push(tagId);
    } else {
      newTagArray.splice(tagIndex, 1);
    }
    setCheckedTags(newTagArray);
    formData.set("tags", newTagArray);
  };

  const showError = () => (
    <div
      className='alert alert-danger'
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className='alert alert-success'
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const createBlogForm = () => {
    return (
      <form onSubmit={submitBlogHandler}>
        <div className='form-group'>
          <label className='text-muted'>Title</label>
          <input
            value={title}
            type='text'
            className='form-control'
            onChange={changeHandler("title")}
          />
        </div>
        <div className='form-group'>
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder='Write something amazing!'
            onChange={bodyChangeHandler}
          />
        </div>
        <div className='form-group'>
          {showError()}
          {showSuccess()}
          <button type='submit' className='btn btn-primary'>
            {isLoading ? (
              <div className='spinner-border' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </form>
    );
  };

  const changeHandler = name => e => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    if (value.size > 1000000) {
      setValues({
        ...values,
        error: "The image should be less than 1mb."
      });
    } else {
      formData.set(name, value);
      setValues({ ...values, [name]: value, formData, error: "" });
    }
  };

  const bodyChangeHandler = e => {
    setBody(e);
    console.log("size: " + e.length);
    if (e.length > 1000000) {
      console.log("TOO BIGG!!!");
      setValues({
        ...values,
        error:
          "The content is to big, please check that the total size of all the images in the body is less than 1MB"
      });
    } else {
      formData.set("body", e);
      if (typeof window !== undefined) {
        localStorage.setItem("blog", JSON.stringify(e));
      }
      setValues({ ...values, error: "" });
    }
  };

  const submitBlogHandler = e => {
    e.preventDefault();
    setIsLoading(true);
    createBlog(formData, token).then(data => {
      if (data.error) {
        setIsLoading(false);
        if (
          data.error ===
          "11000 duplicate key error collection: test.blogs index: slug already exists"
        ) {
          setValues({ ...values, error: "This title is already taken" });
        } else {
          setValues({ ...values, error: data.error });
        }
        console.log(error);
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: `${data.title} as been successfully published`
        });
        setBody("");
        setCategories([]);
        setTags([]);
        setIsLoading(false);
        setTimeout(() => {
          if (isAuth() && isAuth().role === 1) {
            Router.replace(`/admin/crud/blogs`);
          } else {
            Router.replace(`/user/crud/blogs`);
          }
        }, 2000);
      }
    });
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-8'>{createBlogForm()}</div>
        <div className='col-md-4'>
          <div className='form-group pb-2'>
            <h5>Featured Image</h5>
            <hr />
            <label className='btn btn-outline-info'>
              Upload Featured Image
              <input
                onChange={changeHandler("image")}
                type='file'
                accept='image/*'
                hidden
              />
            </label>
            <br />
            <small className='text-muted'>1mb maximum</small>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default withRouter(CreateBlog);
export default CreateBlog;
