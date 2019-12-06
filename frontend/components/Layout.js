import Header from "./Header";
import Header2 from "./Header2";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      {children}
      <style jsx global>
        {`
          body {
            font-family: "Avenir next", Avenir, "Segoe UI", Roboto,
              "Helvetica Neue", Arial, "Noto Sans", sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
          }
          a {
            color: #212529;
          }
          .navbar {
            margin-bottom: 50px;
          }
          #nprogress .bar {
            height: 5px !important;
          }import Header2 from './Header2';

          .featured-image {
            width: 100%;
            max-height: 500px;
            object-fit: cover;
          }
          .mark {
            background-color: #eee;
          }
          p img {
            width: 100%;
          }
          .ql-editor {
            height: 300px;
          }
          .form-control {
            height: calc(1.5em + 0.75rem + 6px);
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default Layout;
