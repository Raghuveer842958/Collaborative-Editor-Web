import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Loading from "./Loading";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user.user);

  console.log("Body component called!!!!");

  const fetchUser = async () => {
    try {
      if (user) {
        return;
      }
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      if (res.status === 200) {
        dispatch(addUser(res.data));
        navigate("/room");
      } else {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
      console.log("Error in fetching the user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <Loading />;

  return (
    <div className="w-screen">

      <Outlet />
  
    </div>
  );
};

export default Body;
