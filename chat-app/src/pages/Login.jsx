import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Logo from '../assets/logos.png';
import { loginRoute } from '../utils/APIRoutes';

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  useEffect(()=>{
    if(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)){
      navigate('/')
    }
  },[])

  const handleValidation = () => {
    const { password, username } = values;
    if (password === "" || username === "") {
      toast.error("Username and password are required", toastOptions);
      return false;
    }
    return true;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;
      try {
        const { data } = await axios.post(loginRoute, { username, password });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(data.user));
          navigate('/');
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.", toastOptions);
      }
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className='brand'>
            <img src={Logo} alt="logo" />
          </div>
          <input
            type="text"
            placeholder='Username'
            name='username'
            onChange={handleChange}
            min='3'
          />
          <input
            type="password"
            placeholder='Password'
            name='password'
            onChange={handleChange}
          />
          <button type='submit'>Login</button>
          <span>Don't have an account? <Link to='/register'>Register</Link></span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;
