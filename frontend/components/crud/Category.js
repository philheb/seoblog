import { useState, useEffect } from "react";
import { getCookie } from "../../actions/auth";
import {
  createCategory,
  getCategories,
  removeCategory
} from "../../actions/category";

const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false
  });

  const { name, error, success, categories, removed, reload } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadCategories();
  }, [reload]);

  const loadCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, categories: data });
      }
    });
  };

  const showCategories = () => {
    return categories.map((category, index) => {
      return (
        <button
          key={index}
          onDoubleClick={() => deleteHandler(category.slug)}
          title='Double-click to delete'
          className='btn btn-outline-primary mr-2 mt-3'
        >
          {category.name}
        </button>
      );
    });
  };
  const changeHandler = e => {
    setValues({
      ...values,
      name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
      error: false,
      success: false,
      removed: ""
    });
  };

  const submitHandler = e => {
    e.preventDefault();
    console.log("Create category", name);
    createCategory({ name }, token).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, error: true });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: "",
          reload: !reload
        });
        // setValues({
        //   ...values,
        //   error: false,
        //   success: false,
        //   name: "",
        //   removed: !removed,
        //   reload: !reload
        // });
      }
    });
  };

  const deleteHandler = slug => {
    let answer = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (answer) {
      removeCategory(slug, token).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({
            ...values,
            error: false,
            reload: !reload,
            success: false,
            removed: !removed
          });
        }
      });
    } else {
      return;
    }
  };

  const showSuccess = () => {
    if (success) {
      return <p className='text-success'>The new category was created.</p>;
    }
  };
  const showError = () => {
    if (error) {
      return <p className='text-danger'>This category already exist.</p>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return (
        <p className='text-danger'>The category was successfully removed.</p>
      );
    }
  };

  // const mouseMoveHandler = () => {
  // console.log("MOVED!!");
  // setValues({ ...values, success: false, error: false, removed: "" });
  // };

  const newCategoryForm = () => (
    <form onSubmit={submitHandler}>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          type='text'
          className='form-control'
          onChange={changeHandler}
          value={name}
          required
        />
      </div>
      <button className='btn btn-primary'>Add</button>
    </form>
  );

  return (
    <React.Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      {/* <div onMouseMove={mouseMoveHandler}> */}
      <div>
        {newCategoryForm()}
        {showCategories()}
      </div>
      <div>
        <p className='pt-4'>* Double click a category to delete it.</p>
      </div>
    </React.Fragment>
  );
};

export default Category;
