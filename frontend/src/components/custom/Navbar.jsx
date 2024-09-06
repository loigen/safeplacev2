import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
import logo from "../../images/logo.png";
import LoginModal from "../Login";
import SignupModal from "../Signup";
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const [activeNavLink, setActiveNavLink] = useState("ABOUT");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };
  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (route) => {
    window.location.href = route;
    if (drawerOpen) {
      setDrawerOpen(false);
    }
  };

  const isActive = (route) => (location.pathname === route ? "active" : "");

  const drawerContent = (
    <List>
      <ListItem
        button
        onClick={() => handleMenuItemClick("/")}
        className={isActive("/")}
      >
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick("/About")}
        className={isActive("/About")}
      >
        <ListItemText primary="About" />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick("/Services")}
        className={isActive("/Services")}
      >
        <ListItemText primary="Services" />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick("/Contact")}
        className={isActive("/Contact")}
      >
        <ListItemText primary="Contact" />
      </ListItem>
      <ListItem
        button
        onClick={() => handleMenuItemClick("/guestBlog")}
        className={isActive("/guestBlog")}
      >
        <ListItemText primary="Blog" />
      </ListItem>
      <ListItem
        button
        onClick={handleOpenLoginModal}
        className={isActive("/signin")}
      >
        <ListItemText primary="Signin/Signup" />
      </ListItem>
    </List>
  );

  return (
    <>
      <nav className="nav-container fixed w-full">
        <div className="nav-content flex justify-between flex-row w-full ">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                variant="temporary"
                sx={{
                  width: 240,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: 240,
                    boxSizing: "border-box",
                  },
                }}
              >
                {drawerContent}
              </Drawer>
            </>
          ) : (
            <div className="nav-links flex-row flex items-center gap-10 px-10">
              <div
                className={`nav-link ${isActive("/")}`}
                onClick={() => handleMenuItemClick("/")}
              >
                Home
              </div>
              <div
                className={`nav-link ${isActive("/About")}`}
                onClick={() => handleMenuItemClick("/About")}
              >
                About
              </div>
              <div
                className={`nav-link ${isActive("/Services")}`}
                onClick={() => handleMenuItemClick("/Services")}
              >
                Services
              </div>
              <div
                className={`nav-link ${isActive("/Contact")}`}
                onClick={() => handleMenuItemClick("/Contact")}
              >
                Contact
              </div>
              <div
                className={`nav-link ${isActive("/guestBlog")}`}
                onClick={() => handleMenuItemClick("/guestBlog")}
              >
                Blog
              </div>
              <div
                className={`nav-link ${isActive("/signin")}`}
                onClick={handleOpenLoginModal}
              >
                Signin/Signup
              </div>
            </div>
          )}
        </div>
      </nav>
      <LoginModal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        handleOpenRegisterModal={handleOpenRegisterModal}
      />
      <SignupModal
        open={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        handleOpenLoginModal={handleOpenLoginModal}
      />
    </>
  );
};

export default Navbar;
