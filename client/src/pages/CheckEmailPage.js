import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);

      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          email: "",
        });
        navigate("/password", {
          state: response?.data?.data,
        });
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
        <div className="w-fit mx-auto mb-1">
          <PiUserCircle size={80} />
        </div>
        <h2 className="mb-8 items-center text-center text-xl">
          Welcome to QuickConnect
        </h2>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          {/* Email Verification */}
          <div className="flex flex-col gap-1 pl-[5px] pr-[5px] ">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              className="bg-violet-200 px-2 py-1 focus:outline-violet-400 rounded-[5px] h-[50px] shadow-[5px_5px_5px_rgba(0,0,0,0.1)]"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <button className="bg-violet-400 text-lg  px-4 py-1 hover:bg-violet-500 rounded mt-2 font-bold text-white leading-relaxed tracking-wide h-[50px] mr-[5px] ml-[5px]">
            Next
          </button>
        </form>

        <p className="my-3 text-center">
          New User ?{" "}
          <Link
            to={"/register"}
            className="hover:text-violet-800 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
