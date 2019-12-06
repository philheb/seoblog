import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";

import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillFormats, QuillModules } from "../../helpers/quill";
import { DOMAIN } from "../../config";

const UpdateBlog = ({ router }) => {
  const token = getCookie("token");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);
  const [body, setBody] = useState("");
  const [values, setValues] = useState({
    title: "",
    error: "",
    success: false,
    formData: "",
    body: ""
  });
  const { title, error, success, formData } = values;

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
  }, [router]);

  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoryArray(data.categories);
          setTagArray(data.tags);
        }
      });
    }
  };

  const setCategoryArray = categories => {
    let catArray = [];
    categories.map((c, i) => {
      catArray.push(c._id);
    });
    setCheckedCategories(catArray);
  };

  const setTagArray = tags => {
    let tagArray = [];
    tags.map((t, i) => {
      tagArray.push(t._id);
    });
    setCheckedTags(tagArray);
  };

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
            checked={showCheckedCategories(category._id)}
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
            checked={showCheckedTags(tag._id)}
          />
          <label className='form-check-label'>{tag.name}</label>
        </li>
      ))
    );
  };

  const showCheckedCategories = catId => {
    const result = checkedCategories.indexOf(catId);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };
  const showCheckedTags = tagId => {
    const result = checkedTags.indexOf(tagId);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
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

  const changeHandler = name => e => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  const bodyChangeHandler = e => {
    setBody(e);
    formData.set("body", e);
  };

  const editBlog = e => {
    e.preventDefault();
    setIsLoading(true);
    updateBlog(formData, token, router.query.slug).then(data => {
      if (data.error) {
        if (
          data.error ===
          "11000 duplicate key error collection: test.blogs index: slug already exists"
        ) {
          setValues({ ...values, error: "This title is already taken" });
        } else {
          setValues({ ...values, error: data.error });
        }
      } else {
        setValues({ ...values, success: `The post was successfully updated` });
        setTimeout(() => {
          if (isAuth() && isAuth().role === 1) {
            Router.replace(`/admin/crud/blogs`);
          } else {
            Router.replace(`/user/crud/blogs`);
          }
        }, 2000);
      }
      setIsLoading(false);
    });
  };

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
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
              "Update"
            )}
          </button>
        </div>
      </form>
    );
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

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-8'>{updateBlogForm()}</div>
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

export default withRouter(UpdateBlog);
