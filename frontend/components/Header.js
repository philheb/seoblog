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
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from "reactstrap";

import Search from "./blog/Search";

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const toggleSearch = () => {
    setSearch(!search);
  };

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
          <Nav className='ml-auto nav-align' navbar>
            <>
              {search ? (
                <div className='row mr-4'>
                  <Search />
                  <NavItem onClick={toggleSearch}>
                    <NavLink
                      style={{
                        fontFamily: "Avenir, Arial, FontAwesome",
                        cursor: "pointer"
                      }}
                    >
                      &#xF002;
                    </NavLink>
                  </NavItem>
                </div>
              ) : (
                <div>
                  <NavItem onClick={toggleSearch}>
                    <NavLink
                      className='row mr-4'
                      style={{
                        fontFamily: "Avenir, Arial, FontAwesome",
                        cursor: "pointer"
                      }}
                    >
                      &#xF002;
                    </NavLink>
                  </NavItem>
                </div>
              )}

              {/* <NavItem>
                <a
                  href='/user/crud/blog'
                  className='btn btn-primary text-light'
                >
                  New Post
                </a>
              </NavItem> */}

              <NavItem>
                <Link href='/blogs'>
                  <NavLink className='mr-4' style={{ cursor: "pointer" }}>
                    Blog
                  </NavLink>
                </Link>
              </NavItem>
            </>
            {!isAuth() && (
              <>
                <NavItem>
                  <Link href='/signin'>
                    <NavLink
                      className='mr-4'
                      style={{ cursor: "pointer" }}
                      // className='btn btn-outline-danger text-danger mr-2'
                    >
                      Log In
                    </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href='/signup'>
                    <NavLink className='mr-4' style={{ cursor: "pointer" }}>
                      Sign Up
                    </NavLink>
                  </Link>
                </NavItem>
              </>
            )}

            {isAuth() && (
              <>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav>
                    <img
                      src={isAuth().imageUrl}
                      className='rounded-circle'
                      alt='user-avatar'
                      style={{ height: "40px" }}
                    />
                  </DropdownToggle>

                  <DropdownMenu right>
                    <Link href={`/profile/${isAuth().username}`}>
                      <DropdownItem className='font-weight-bold'>
                        {isAuth() && isAuth().name}
                      </DropdownItem>
                    </Link>
                    <a href='/user/crud/blog'>
                      <DropdownItem>New Post</DropdownItem>
                    </a>

                    <a
                      href={
                        isAuth() && isAuth().role === 1
                          ? "/admin/crud/blogs"
                          : "/user/crud/blogs"
                      }
                    >
                      <DropdownItem>Posts</DropdownItem>
                    </a>

                    <DropdownItem divider />

                    <Link href={`/profile/${isAuth().username}`}>
                      <DropdownItem>Profile</DropdownItem>
                    </Link>
                    <Link
                      href={
                        isAuth() && isAuth().role === 1 ? "/admin" : "/user"
                      }
                    >
                      <DropdownItem>Setting</DropdownItem>
                    </Link>

                    <DropdownItem divider />
                    <Link href='/contact'>
                      <DropdownItem>Contact Us</DropdownItem>
                    </Link>
                    <DropdownItem
                      onClick={() => signout(() => Router.replace("/"))}
                    >
                      Sign Out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
      <style jsx global>
        {`
          @media (min-width: 768px) {
            .nav-align {
              align-items: center;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Header;
