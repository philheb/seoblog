import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { getCookie, isAuth, updateUser } from "../../actions/auth";
import { getProfile, updateProfile } from "../../actions/user";
import { API, DOMAIN } from "../../config";

const UpdateProfile = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    password: "",
    error: false,
    success: false,
    loading: false,
    userData: "",
    isLoading: false,
    loadingPicture: false
  });
  const [imageUrl, setImageUrl] = useState("");

  const token = getCookie("token");

  const {
    username,
    name,
    email,
    about,
    password,
    error,
    success,
    loading,
    userData,
    isLoading,
    loadingPicture
  } = values;

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    setValues({ ...values, isLoading: true, loadingPicture: true });
    getProfile(token).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, isLoading: false });
      } else {
        setValues({
          ...values,
          username: data.username,
          name: data.name,
          email: data.email,
          about: data.about,
          isLoading: false,
          loadingPicture: false
        });
        setImageUrl(data.imageUrl);
      }
    });
  };

  const updateProfileForm = () => {
    if (isLoading) {
      return (
        <div className='spinner-border text-primary' role='status'>
          <span className='sr-only'>Loading...</span>
        </div>
      );
    } else {
      return (
        <form onSubmit={submitHandler} autoComplete='off'>
          <div className='form-group'>
            <label className='text-muted'>Profile Picture</label>
            <input
              className='form-control'
              onChange={changeHandler("image")}
              type='file'
              placeholder='Upload a profile picture'
            />
            {/* <img
              style={{ maxHeight: "200px" }}
              className='pt-2'
              src={file}
            ></img> */}
          </div>

          <div className='form-group'>
            <label className='text-muted'>Username</label>
            <input
              onChange={changeHandler("username")}
              value={username}
              type='text'
              className='form-control'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Name</label>
            <input
              onChange={changeHandler("name")}
              value={name}
              type='text'
              className='form-control'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Email</label>
            <input
              onChange={changeHandler("email")}
              value={email}
              type='email'
              className='form-control'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>About</label>
            <textarea
              onChange={changeHandler("about")}
              value={about}
              type='text'
              className='form-control'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Password</label>
            <input
              onChange={changeHandler("password")}
              value={password}
              type='password'
              className='form-control'
              autoComplete='off'
            />
          </div>
          <button type='submit' className='btn btn-primary'>
            Submit
          </button>
        </form>
      );
    }
  };

  // const imageChangeHandler = async e => {
  //   setValues({ ...values, loadingPicture: true });
  //   const file = e.target.files[0];
  //   const data = new FormData();
  //   data.append("file", file);
  //   data.append("upload_preset", "seoblog");
  //   const res = await fetch(
  //     "https://api.cloudinary.com/v1_1/seoblog/image/upload",
  //     {
  //       method: "POST",
  //       body: data
  //     }
  //   );
  //   const image = await res.json();
  //   let userFormData = new FormData();
  //   userFormData.set("imageUrl", image.secure_url);
  //   setValues({
  //     ...values,
  //     userData: userFormData,
  //     imageUrl: image.secure_url,
  //     loadingPicture: false
  //   });
  // };

  const changeHandler = name => async e => {
    let userFormData = new FormData();
    let value = e.target.value;
    if (name === "image") {
      setValues({ ...values, loadingPicture: true });
      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "seoblog");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/seoblog/image/upload",
        {
          method: "POST",
          body: data
        }
      );
      const image = await res.json();
      userFormData.append("imageUrl", image.secure_url);
      setImageUrl(image.secure_url);
      setValues({ ...values, loadingPicture: false });
    } else {
      userFormData.append(name, e.target.value);
    }
    userFormData.append("imageUrl", imageUrl);
    setValues({
      ...values,
      [name]: value,
      userData: userFormData,
      error: false,
      success: false
    });
    console.log(userData);
  };

  const submitHandler = e => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    updateProfile(token, userData).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false
        });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            success: true,
            loading: false
          });
        });
        window.location.href = `/user/update`;
      }
    });
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
      <p>Your profile has been successfully updated</p>
    </div>
  );

  const showLoading = () => (
    <div
      className='alert alert-info'
      style={{ display: loading ? "" : "none" }}
    >
      <p>Loading...</p>
    </div>
  );

  return (
    <React.Fragment>
      <div className='container mt-5'>
        <div className='row'>
          <div className='col-md-4'>
            {loadingPicture ? (
              <div className='spinner-border text-primary' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              <img
                src={imageUrl}
                style={{ maxWidth: "100%", maxHeight: "auto" }}
                alt='user profile'
                className='img img-fluid mb-3 rounded-circle '
                style={{
                  borderStyle: "solid",
                  borderWidth: " 0 2px 0 2px",
                  borderColor: "#007bff"
                }}
                //border-left-0 border-right-0 border-primary
              />
            )}
          </div>
          <div className='col-md-8'>
            {showSuccess()}
            {showError()}
            {showLoading()}
            {updateProfileForm()}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UpdateProfile;
