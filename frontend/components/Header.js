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

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color='light' light expand='md'>
        <Link href='/'>
          <NavLink style={{ cursor: "pointer" }} className='font-weight-bold'>
            {APP_NAME}
          </NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ml-auto' navbar>
            <>
              <Search />
              {isAuth() && (
                <NavItem>
                  <NavLink
                    href='/user/crud/blog'
                    // className='btn btn-primary text-light'
                    style={{ cursor: "pointer" }}
                  >
                    New Post
                  </NavLink>
                </NavItem>
              )}

              <NavItem>
                <Link href='/blogs'>
                  <NavLink style={{ cursor: "pointer" }}>Blog</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href='/contact'>
                  <NavLink style={{ cursor: "pointer" }}>Contact</NavLink>
                </Link>
              </NavItem>
            </>
            {!isAuth() && (
              <>
                <NavItem>
                  <Link href='/signin'>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      // className='btn btn-outline-danger text-danger mr-2'
                    >
                      Log In
                    </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href='/signup'>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      // className='btn btn-danger text-light'
                    >
                      Sign Up
                    </NavLink>
                  </Link>
                </NavItem>
              </>
            )}

            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href='/user'>
                  <NavLink style={{ cursor: "pointer" }}>Dashboard</NavLink>
                </Link>
              </NavItem>
            )}

            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href='/admin'>
                  <NavLink style={{ cursor: "pointer" }}>Dashboard</NavLink>
                </Link>
              </NavItem>
            )}

            {isAuth() && (
              <NavItem>
                <NavLink
                  onClick={() => signout(() => Router.replace("/"))}
                  style={{ cursor: "pointer" }}
                >
                  Sign Out
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
