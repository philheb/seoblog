import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";

import { APP_NAME } from "../config";
import { signout, isAuth } from "../actions/auth";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

import Search from "./blog/Search";

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header2 = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <a className='navbar-brand' href='#'>
          SEOBLOG
        </a>
        <button
          className='navbar-toggler'
          type='button'
          datatoggle='collapse'
          dataTarget='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav ml-auto'>
            <Search />
            <li className='nav-item'>
              <a
                className='nav-link btn btn-primary text-light'
                href='/user/crud/blog'
              >
                New Post
              </a>
            </li>
            <li className='nav-item'>
              <Link href='/blogs'>
                <a className='nav-link'>Blog</a>
              </Link>
            </li>

            <li className='nav-item'>
              <a className='nav-link' href='#'>
                Pricing
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link disabled'
                href='#'
                tabindex='-1'
                aria-disabled='true'
              >
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

const styles = {
  pointer: {
    cursor: "pointer"
  }
};

export default Header2;
