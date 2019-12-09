import fetch from "isomorphic-fetch";
import { API } from "../config";
import { isAuth, handleResponse } from "./auth";

export const createBlog = (blog, token) => {
  let createBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    createBlogEndpoint = `${API}/blog`;
  } else {
    createBlogEndpoint = `${API}/user/blog`;
  }
  return fetch(createBlogEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: blog
  })
    .then(res => {
      handleResponse(res);
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const listBlogs = (skip, limit) => {
  const data = { limit, skip };

  return fetch(`${API}/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const listRecent = () => {
  return fetch(`${API}/blogs/recent`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const singleBlog = slug => {
  return fetch(`${API}/blog/${slug}`, {
    method: "GET"
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const listRelated = post => {
  const blog = {
    blog: {
      _id: post.blog._id,
      categories: post.blog.categories
    }
  };
  return fetch(`${API}/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(blog)
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const list = username => {
  let listBlogsEndpoint = username
    ? `${API}/${username}/blogs`
    : `${API}/blogs`;

  return fetch(listBlogsEndpoint, {
    method: "GET"
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const removeBlog = (slug, token) => {
  let removeBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    removeBlogEndpoint = `${API}/blog/${slug}`;
  } else {
    removeBlogEndpoint = `${API}/user/blog/${slug}`;
  }

  return fetch(removeBlogEndpoint, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      handleResponse(res);
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const updateBlog = (blog, token, slug) => {
  let updateBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    updateBlogEndpoint = `${API}/blog/${slug}`;
  } else {
    updateBlogEndpoint = `${API}/user/blog/${slug}`;
  }
  return fetch(updateBlogEndpoint, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: blog
  })
    .then(res => {
      handleResponse(res);
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};

export const listSearch = query => {
  return fetch(`${API}/blogs/search?search=${query}`, {
    method: "GET"
  })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};
