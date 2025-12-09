import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import AccountSideBar from "../../components/AccountSidebar";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [isPwdLoading, setIsPwdLoading] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) history("/");
    if (context?.userData?.email) {
      setPasswordFields((prev) => ({ ...prev, email: context.userData.email }));
    }
  }, [context?.userData]);

  const onChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordFields({ ...passwordFields, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsPwdLoading(true);

    if (!passwordFields.newPassword || !passwordFields.confirmPassword) {
      context.openAlertBox("error", "Please fill all fields");
      setIsPwdLoading(false);
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      context.openAlertBox("error", "Passwords do not match");
      setIsPwdLoading(false);
      return;
    }

    const res = await postData("/api/user/reset-password", passwordFields);
    setIsPwdLoading(false);

    if (res?.error !== true) {
      context.openAlertBox("success", res?.message || "Password changed");
      setPasswordFields({
        email: passwordFields.email,
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      context.openAlertBox("error", res?.message || "Something went wrong");
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
              Change Password
            </h2>
            <form className="!mt-5" onSubmit={handlePasswordSubmit}>
              <div className="flex flex-col gap-4">
                <TextField
                  type="email"
                  label="Email"
                  size="small"
                  value={passwordFields.email}
                  disabled
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  size="small"
                  value={passwordFields.newPassword}
                  onChange={onChangePasswordInput}
                  disabled={isPwdLoading}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  size="small"
                  value={passwordFields.confirmPassword}
                  onChange={onChangePasswordInput}
                  disabled={isPwdLoading}
                />
              </div>
              <br />
              <Button
                type="submit"
                disabled={isPwdLoading || !passwordFields.newPassword}
                className="btn-org btn-lg w-[120px] flex gap-3 text-[13px]"
              >
                {isPwdLoading ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  "Change"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
