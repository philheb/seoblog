import { useState, useEffect } from "react";
import Router from "next/router";
import { withRouter } from "next/router";

const Search = () => {
  const [values, setValues] = useState({
    search: undefined,
    results: [],
    searched: false,
    message: ""
  });

  const { search, results, searched, message } = values;

  const searchForm = () => (
    <form onSubmit={submitHandler} className='form-inline my-2 my-md-0'>
      <input
        className='form-control mr-sm-2'
        type='search'
        placeholder='&#xF002; Search'
        aria-label='Search'
        onChange={changeHandler}
        style={{ fontFamily: "Avenir, Arial, FontAwesome" }}
      />
    </form>
  );

  const changeHandler = e => {
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: undefined,
      message: ""
    });
  };

  const submitHandler = e => {
    e.preventDefault();
    Router.push({
      pathname: "/blogs/search",
      query: { search: search }
    });
  };

  return <div>{searchForm()}</div>;
};

export default withRouter(Search);
