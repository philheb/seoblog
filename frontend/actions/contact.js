import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

export const sendContactForm = data => {
  let contactEndpoint;
  if (data.authorEmail) {
    contactEndpoint = `${API}/contact-blog-author`;
  } else {
    contactEndpoint = `${API}/contact`;
  }
  return fetch(`${contactEndpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      handleResponse(res);
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};
