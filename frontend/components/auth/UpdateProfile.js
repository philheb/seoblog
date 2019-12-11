import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { getCookie, isAuth, updateUser } from "../../actions/auth";
import { getProfile, updateProfile } from "../../actions/user";
import { API, DOMAIN } from "../../config";

const UpdateProfile = () => {
  const [values, setValues] = useState({
    id: "",
    username: "",
    name: "",
    email: "",
    about: "",
    error: false,
    success: false,
    userData: "",
    isLoading: false,
    loadingPicture: false
  });
  const [imageUrl, setImageUrl] = useState("");

  const token = getCookie("token");

  const {
    id,
    username,
    name,
    email,
    about,
    error,
    success,
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
          id: data._id,
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
            <small className='text-muted'>
              Please use an image smaller than 10mb
            </small>
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
              rows='6'
              maxLength='300'
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
    if (name === "image") {
      setValues({ ...values, loadingPicture: true });
      const file = e.target.files[0];
      if (file.size > 10000000) {
        setValues({
          ...values,
          loadingPicture: false,
          error: "The image should be less than 10mb."
        });
      } else {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "profile");
        try {
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/seoblog/image/upload",
            {
              method: "POST",
              body: data
            }
          );
          const image = await res.json();
          setImageUrl(image.secure_url);
          setValues({
            ...values,
            loadingPicture: false,
            error: false,
            success: false
          });
        } catch (e) {
          setValues({ ...values, loadingPicture: false });
        }
      }
    } else {
      setValues({
        ...values,
        [name]: e.target.value,
        error: false,
        success: false
      });
    }
  };

  const submitHandler = e => {
    e.preventDefault();
    setValues({ ...values, isLoading: true });
    const userData = { id, username, name, email, about, imageUrl };
    updateProfile(token, userData).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          isLoading: false
        });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            success: true,
            isLoading: false
          });
        });
        window.location.href = `/profile/${username}`;
      }
    });
  };

  // const submitHandler = e => {
  //   e.preventDefault();
  //   setValues({ ...values, loading: true });
  //   updateProfile(token, userData).then(data => {
  //     if (data.error) {
  //       setValues({
  //         ...values,
  //         error: data.error,
  //         success: false,
  //         loading: false
  //       });
  //     } else {
  //       updateUser(data, () => {
  //         setValues({
  //           ...values,
  //           success: true,
  //           loading: false
  //         });
  //       });
  //       window.location.href = `/user/update`;
  //     }
  //   });
  // };

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
      style={{ display: isLoading ? "" : "none" }}
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
