import { useState, useEffect } from "react";
import Router from "next/router";

import { sendContactForm } from "../actions/contact";

const ContactForm = ({ authorEmail }) => {
  const [values, setValues] = useState({
    email: "",
    name: "",
    message: "",
    success: false,
    error: false,
    isLoading: false
  });
  const { email, name, message, error, success, isLoading } = values;

  useEffect(() => {}, []);

  const onChangeHandler = name => e => {
    const value = e.target.value;
    setValues({
      ...values,
      [name]: value,
      error: false,
      success: false
    });
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    setValues({ ...values, isLoading: true });
    sendContactForm({ name, email, message, authorEmail }).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, isLoading: false });
      } else {
        console.log(data);
        setValues({ ...values, isLoading: false, success: true });
      }
    });
    setValues({ ...values, isLoading: false });
  };

  const showError = () => {
    if (error) {
      return <div className='alert alert-danger'>{error}</div>;
    }
    return;
  };

  const showSuccess = () => {
    if (success) {
      return (
        <div className='alert alert-success'>
          Your message has been successfully sent. We will get back to you as
          soon as possible!
        </div>
      );
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <div className='form-group'>
        <label>Name</label>
        <input
          onChange={onChangeHandler("name")}
          value={name}
          type='text'
          className='form-control'
          placeholder='John Smith'
        />
      </div>
      <div className='form-group'>
        <label>Email address</label>
        <input
          onChange={onChangeHandler("email")}
          value={email}
          type='email'
          className='form-control'
          placeholder='name@example.com'
        />
      </div>
      <div className='form-group'>
        <label>Message</label>
        <textarea
          onChange={onChangeHandler("message")}
          value={message}
          className='form-control'
          rows='5'
        ></textarea>
      </div>
      <button type='submit' className='btn btn-primary mb-3'>
        Submit
      </button>
      {showError()}
      {showSuccess()}
    </form>
  );
};

export default ContactForm;
