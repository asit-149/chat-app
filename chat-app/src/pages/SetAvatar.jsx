import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import loader from '../assets/loader.gif';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Buffer } from 'buffer';
import { setAvatarRoute } from '../utils/APIRoutes'; // Replace with your actual API route

const api = "https://api.multiavatar.com";

function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate('/login');
    }
  }, [navigate]);

  const MAX_RETRIES = 10; // Increase the number of retry attempts if needed

const fetchAvatarsWithRetry = async () => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const requests = Array.from({ length: 4 }, () => {
        const url = `${api}/${Math.round(Math.random() * 1000)}`;
        return axios.get(url);
      });

      const responses = await Promise.all(requests);
      const data = responses.map(response => {
        if (response.headers['content-type'].startsWith('image/svg+xml')) {
          return btoa(response.data);
        } else {
          const buffer = Buffer.from(response.data);
          return buffer.toString("base64");
        }
      });

      setAvatars(data);
      setIsLoading(false);
      return;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff
        console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        console.error("Error fetching avatars:", error);
        toast.error("Failed to load avatars", { position: "bottom-right" });
        setIsLoading(false);
        return;
      }
    }
  }

  console.error("Exceeded maximum retries for fetching avatars.");
  toast.error("Failed to load avatars after multiple retries", { position: "bottom-right" });
  setIsLoading(false);
};


  useEffect(() => {
    fetchAvatarsWithRetry();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", { position: "bottom-right" });
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      const response = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (response.data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = response.data.image;
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(user));
        navigate('/');
      } else {
        toast.error("Error setting avatar. Please try again.", { position: "bottom-right" });
      }
    } catch (error) {
      console.error("Error setting avatar:", error);
      toast.error("Failed to set avatar. Please try again.", { position: "bottom-right" });
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                key={index}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  key={avatar}
                />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #131324;

  .loader {
    width: 100px;
  }

  .title-container {
    margin-bottom: 2rem;
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        cursor: pointer;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    margin-top: 2rem;
    &:hover {
      background-color: #997af0;
    }
  }
`;

export default SetAvatar;
