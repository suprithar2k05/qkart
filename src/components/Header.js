import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const userName = localStorage.getItem("username");





  const handleRemoveFromLocalStorage = () => {
    localStorage.clear();
    window.location.reload()
  };

  return (
    <div className="header" data-testid="header-container">
      <div className="header-title">
        <Link to='/'>
          <img src="logo_light.svg" alt="QKart-icon" />
        </Link>
      </div>
      {children}
      {hasHiddenAuthButtons ?  (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={(e) => history.push('/')}
          >
            Back to explore
          </Button>
        ) :(
        userName ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar alt={userName} src="/public/avatar.png"/>
            <p>{userName}</p>
            <Button variant="contained" onClick={handleRemoveFromLocalStorage}>
              logout
            </Button>
          </Stack>
        )  : (
        <Stack direction="row">
        <Button variant="text" onClick={(e) => history.push('/login')} >Login</Button>
        <Button variant="contained" onClick={(e) => history.push('/register')}>Register</Button>
        </Stack>
      ) 
    )}  
    </div>
  );
};

export default Header;
