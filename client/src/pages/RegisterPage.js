import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
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

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);

    setUploadPhoto(file);

    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url,
      };
    });
  };
  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log("response", response);

      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });

        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    console.log("data", data);
  };

  return (
    <div className="mt-10 bg-white w-full max-w-md rounded-[20px] overflow-hidden p-4 mx-auto shadow-[10px_10px_10px_rgba(0,0,0,0.1)]">
      <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto">
        <h3 className="items-center text-center text-2xl">SignUp</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              className="bg-violet-200 px-2 py-1 focus:outline-violet-400 rounded-[5px] h-[50px] shadow-[5px_5px_5px_rgba(0,0,0,0.1)]"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-violet-200 px-2 py-1 focus:outline-violet-400 rounded-[5px] h-[50px] shadow-[5px_5px_5px_rgba(0,0,0,0.1)]"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create your password"
              className="bg-violet-200 px-2 py-1 focus:outline-violet-400 rounded-[5px] h-[50px] shadow-[5px_5px_5px_rgba(0,0,0,0.1)]"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              <div
                className=" bg-violet-200 flex justify-center items-center border rounded-corner hover:border-violet-500 
              rounded-[5px] h-[50px] cursor-pointer"
              >
                <p className="text-md max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>

            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>

          <button className="bg-violet-400 text-lg  px-4 py-1 hover:bg-violet-500 rounded mt-2 font-bold text-white leading-relaxed tracking-wide h-[50px] mr-[5px] ml-[5px]">
            SignUp
          </button>
        </form>

        <p className="my-3 text-center">
          Already have account ?{" "}
          <Link to={"/email"} className="hover:text-violet-800 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
