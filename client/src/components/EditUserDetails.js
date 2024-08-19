import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast"; // Corrected typo here
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name || "", // Corrected the key from 'user' to 'name'
    profile_pic: user?.profile_pic || "", // Ensure it's correctly set
  });

  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setData((prev) => ({
        ...prev,
        ...user,
      }));
    }
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();

    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const uploadPhoto = await uploadFile(file);

      setData((prev) => ({
        ...prev,
        profile_pic: uploadPhoto?.url,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Inspect the data object before sending the request
    console.log("Data to be sent:", data);

    // Use a deep clone function to remove circular references
    const cleanData = JSON.parse(JSON.stringify(data, getCircularReplacer()));

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;

      const response = await axios({
        method: "post",
        url: URL,
        data: cleanData,
        withCredentials: true,
      });

      console.log("response", response);
      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the profile");
    }
  };
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-violet-400 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white w-full max-w-md rounded-[20px] overflow-hidden p-5 mx-auto shadow-[10px_10px_10px_rgba(0,0,0,0.1)]">
        <h2 className="font-semibold text-xl mb-0.5">Profile Details</h2>
        <p className="text-md">Edit user details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="mb-1">
              Username :
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="bg-violet-200 px-2 py-1 focus:outline-violet-400 rounded-[5px] h-[50px] shadow-[5px_5px_5px_rgba(0,0,0,0.1)]"
            />
          </div>

          <div>
            <div>Profile Picture :</div>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="font-semibold"
                  onClick={handleOpenUploadPhoto}
                >
                  Edit profile picture
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />
          <div className="flex gap-2 w-fit ml-auto">
            <button
              onClick={onClose}
              className="border-violet-700 border px-4 py-1 rounded hover:bg-violet-200 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit" // Changed from onClick to type="submit"
              className="border-violet-700 bg-violet-400 text-white border px-4 py-1 rounded hover:bg-violet-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
