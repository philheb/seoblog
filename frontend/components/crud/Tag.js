import { useState, useEffect } from "react";
import { getCookie } from "../../actions/auth";
import { createTag, getTags, removeTag } from "../../actions/tag";

const Tag = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    tags: [],
    removed: false,
    reload: false
  });

  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadTags();
  }, [reload]);

  const loadTags = () => {
    getTags().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, tags: data });
      }
    });
  };

  const showTags = () => {
    return tags.map((tag, index) => {
      return (
        <button
          key={index}
          onDoubleClick={() => deleteHandler(tag.slug)}
          title="Double-click to delete"
          className="btn btn-outline-primary mr-2 mt-3"
        >
          {tag.name}
        </button>
      );
    });
  };
  const changeHandler = e => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: ""
    });
  };

  const submitHandler = e => {
    e.preventDefault();
    console.log("Create tag", name);
    createTag({ name }, token).then(data => {
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
      }
    });
  };

  const deleteHandler = slug => {
    let answer = window.confirm("Are you sure you want to delete this tag?");
    if (answer) {
      removeTag(slug, token).then(data => {
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
      return <p className="text-success">The new tag was created.</p>;
    }
  };
  const showError = () => {
    if (error) {
      return <p className="text-danger">This tag already exist.</p>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">The tag was successfully removed.</p>;
    }
  };
  // Remove message when move mouse
  // const mouseMoveHandler = () => {
  // console.log("MOVED!!");
  // setValues({ ...values, success: false, error: false, removed: "" });
  // };

  const newTagForm = () => (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={changeHandler}
          value={name}
          required
        />
      </div>
      <button className="btn btn-primary">Add</button>
    </form>
  );

  return (
    <React.Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      {/* <div onMouseMove={mouseMoveHandler}> */}
      <div>
        {newTagForm()}
        {showTags()}
      </div>
      <div>
        <p className="pt-4">* Double click a tag to delete it.</p>
      </div>
    </React.Fragment>
  );
};

export default Tag;
