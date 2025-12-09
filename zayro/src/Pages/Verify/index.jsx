import React, { useContext, useEffect, useState } from "react";
import OtpBox from "../../components/OtpBox";
import Button from "@mui/material/Button";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const Verify = () => {
  const [otp, setOtp] = useState("");

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const history = useNavigate();
  const context = useContext(MyContext);

  const verifyOTP = (e) => {
    e.preventDefault();

    const actionType = localStorage.getItem("actionType");

    if (actionType !== "forgot-password") {
      postData("/api/user/verifyEmail", {
        email: localStorage.getItem("userEmail"),
        otp: otp,
      }).then((res) => {
        if (res?.error === false) {
          localStorage.removeItem("userEmail");
          context.openAlertBox("success", res?.message);
          history("/login");
        } else {
          context.openAlertBox("error", res?.message);
        }
      });
    } else {
      postData("/api/user/verify-forgot-password-otp", {
        email: localStorage.getItem("userEmail"),
        otp: otp,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertBox("success", res?.message);
          history("/forgot-password");
        } else {
          context.openAlertBox("error", res?.message);
        }
      });
    }
  };

  return (
    <section className="section !py-10">
      <div className="container">
        <div className="card shadow-md w-[400px] !m-auto rounded-md bg-white !p-5 !px-10">
          <div className="text-center flex items-center justify-center">
            <img src="/verify1.png" width="80" />
          </div>
          <h3 className="text-center text-[18px] text-black !mt-4 !mb-5">
            Verify OTP
          </h3>

          <p className="text-center">
            OTP send to{" "}
            <span className="text-[#ff5252] font-[600]">
              {localStorage.getItem("userEmail")}
            </span>
          </p>

          <form onSubmit={verifyOTP}>
            <OtpBox length={6} onChange={handleOtpChange} />

            <div className="flex items-center justify-center !mt-5 !px-2">
              <Button
                type="submit"
                className="w-full btn-org btn-lg !text-[14px]"
              >
                Verify OTP
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Verify;
