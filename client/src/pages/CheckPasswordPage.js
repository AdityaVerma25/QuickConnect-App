import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);

        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-10 flex justify-between pl-[100px] pr-[100px]">
      <div className=" flex items-center justify-center p-[20px]">
        <div>
          <h1 className="text-6xl text-violet-600 mb-2 ">Quick Connect</h1>
          <h3 className="text-2xl text-black">
            Bringing people together to share moments, spark conversations
          </h3>
        </div>
      </div>
      <div className="bg-white w-full max-w-md rounded-[20px] overflow-hidden p-4 mx-auto shadow-[10px_10px_10px_rgba(0,0,0,0.1)]">
        <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
          {/* <PiUserCircle
                  size={80}
                /> */}
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-1">
            {location?.state?.name}
          </h2>
        </div>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 pl-[5px] pr-[5px] ">
            <label htmlFor="password"></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="bg-violet-200 px-2 py-1 focus:outline-violet-400 rounded-[5px] h-[50px] shadow-[5px_5px_5px_rgba(0,0,0,0.1)]"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-violet-400 text-lg  px-4 py-1 hover:bg-violet-500 rounded mt-2 font-bold text-white leading-relaxed tracking-wide h-[50px] mr-[5px] ml-[5px]">
            Login
          </button>
        </form>

        <p className="my-3 text-center">
          <Link
            to={"/forgot-password"}
            className="hover:text-violet-800 font-semibold"
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
