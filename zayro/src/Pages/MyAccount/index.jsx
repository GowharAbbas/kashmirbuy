import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import AccountSideBar from "../../components/AccountSidebar";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { editData } from "../../utils/api";

const MyProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [originalFields, setOriginalFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) history("/");
  }, [context?.isLogin]);

  useEffect(() => {
    if (context?.userData?._id) {
      setUserId(context?.userData?._id);
      const newUser = {
        name: context.userData.name || "",
        email: context.userData.email || "",
        mobile: context.userData.mobile || "",
      };
      setFormFields(newUser);
      setOriginalFields(newUser);
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const onlyDigits = value
        .replace(/^(\+91)/, "")
        .replace(/\D/g, "")
        .slice(0, 10);
      setFormFields({ ...formFields, [name]: onlyDigits });
    } else {
      setFormFields({ ...formFields, [name]: value });
    }
  };

  const isChanged =
    formFields.name !== originalFields.name ||
    formFields.mobile !== originalFields.mobile;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name || !formFields.email || !formFields.mobile) {
      context.openAlertBox("error", "Please fill all fields");
      setIsLoading(false);
      return;
    }

    const res = await editData(`/api/user/${userId}`, formFields);
    setIsLoading(false);

    if (res?.error !== true) {
      context.openAlertBox("success", res?.data?.message || "Profile updated");
      const updatedUser = { ...context.userData, ...formFields, ...res?.data };
      context.setUserData(updatedUser);
      setOriginalFields(updatedUser);
    } else {
      context.openAlertBox("error", res?.data?.message);
    }
  };

  return (
    <section className="!py-14 w-full bg-[#f5f5f5]">
      <div className="container flex flex-col lg:flex-row gap-5">
        <div className="col1 w-full lg:w-[25%]">
          <AccountSideBar />
        </div>

        <div className="col2 w-full lg:w-[75%]">
          <div className="card bg-white !p-4 sm:p-5 shadow-md rounded-md">
            <h2 className="text-[16px] sm:text-[18px] font-semibold">
              My Profile
            </h2>
            <form className="!mt-5" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-3">
                <TextField
                  label="Full Name"
                  name="name"
                  size="small"
                  className="w-full md:w-1/2"
                  value={formFields.name}
                  onChange={onChangeInput}
                  disabled={isLoading}
                />
                <TextField
                  label="Email"
                  type="email"
                  size="small"
                  className="w-full md:w-1/2"
                  name="email"
                  value={formFields.email}
                  disabled
                />
              </div>

              <div className="flex items-center !mt-4">
                <TextField
                  label="Phone Number"
                  name="mobile"
                  size="small"
                  className="w-full"
                  value={formFields.mobile}
                  onChange={onChangeInput}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+91</InputAdornment>
                    ),
                  }}
                />
              </div>

              <br />
              <Button
                type="submit"
                disabled={!isChanged || isLoading}
                className="btn-org btn-lg w-[120px] flex gap-3 text-[13px]"
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  "Update"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
