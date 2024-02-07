import { Avatar, Button, Dropdown, Navbar, NavbarCollapse, TextInput } from "flowbite-react";
import { Link , useLocation} from "react-router-dom";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon,  FaSun } from "react-icons/fa";
import Projects from './../pages/Projects';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from "../redux/theme/themeSlice";

const Header = () => {

  const path = useLocation().pathname;
  const { currentuser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Bhallu's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        ></TextInput>
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch></AiOutlineSearch>
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={()=>
          dispatch(toggleTheme()) 
        }>
          {theme === 'light' ?  <FaMoon></FaMoon> :<FaSun></FaSun> }
          
        </Button>
        {
          currentuser ? (
          <Dropdown
          arrowIcon={false}
          inline
          label = {
            <Avatar 
              alt="user"
              img={ currentuser.profilePhoto }
              rounded
            />
          }
          >
           <Dropdown.Header >
           <span 
            className="font-semibold block text-sm"
            >@{ currentuser.username}</span>
            <span className="block text-sm text-gray-500 truncate">{currentuser.email}</span> 
           </Dropdown.Header>
           
            <Dropdown.Item>
              <Link to={"/dashboard?tab=profile"}>Profile</Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Link to={"/sign-out"}>Sign Out</Link>
            </Dropdown.Item>

          </Dropdown>
        ) :
        (
        <Link to={"/sign-in"}>
          <Button gradientDuoTone={"purpleToBlue"} pill outline>
            Sign In
          </Button>
        </Link>
        )
        }
        <Navbar.Toggle></Navbar.Toggle>
      </div>
        <NavbarCollapse>
          <Navbar.Link active={path==='/'} as={ 'div'}>
            <Link to={"/"}>Home</Link>
          </Navbar.Link>

          <Navbar.Link active={path==='/about'} as={ 'div'}>
            <Link to={"/about"}>About</Link>
          </Navbar.Link>

          <Navbar.Link active={path==='/projects'} as={ 'div'}>
            <Link to={"/projects"}>Projects</Link>
          </Navbar.Link>
        </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
