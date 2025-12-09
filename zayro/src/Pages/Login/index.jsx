import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "../../utils/api";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const forgotPassword = () => {
    if (formFields.email === "") {
      context.openAlertBox("error", "Please enter email id");
      return false;
    } else {
      localStorage.setItem("userEmail", formFields.email);
      context.openAlertBox("success", `OTP send to ${formFields.email}`);
      localStorage.setItem("actionType", "forgot-password");

      postData("/api/user/forgot-password", {
        email: formFields.email,
      }).then((res) => {
        if (res?.error === false) {
          context.openAlertBox("success", res?.message);
          history("/verify");
        } else {
          context.openAlertBox("error", res?.message);
        }
      });
    }
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.email === "") {
      context.openAlertBox("error", "Please enter email address");
      return false;
    }

    if (formFields.password === "") {
      context.openAlertBox("error", "Please enter password");
      return false;
    }

    postData("/api/user/login", formFields, { withCredentials: true }).then(
      (res) => {
        //console.log(res);

        if (res?.error !== true) {
          setIsLoading(false);
          context.openAlertBox("success", res?.message);
          setFormFields({
            email: "",
            password: "",
          });

          localStorage.setItem("accessToken", res?.data?.accesstoken);
          localStorage.setItem("refreshToken", res?.data?.refreshToken);

          context.setIsLogin(true);

          history("/");
        } else {
          context.openAlertBox("error", res?.message);
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <section className="section !py-5 !mt-8">
      <div className="container">
        <div className="card shadow-md w-[400px] !m-auto rounded-md bg-white !p-5 !px-10">
          <h3 className="text-center text-[18px] text-black !mb-4">
            Login to your account
          </h3>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="form-group w-full !mb-5">
              <TextField
                type="email"
                id="email"
                name="email"
                value={formFields.email}
                disabled={isLoading === true ? true : false}
                label="Email Id *"
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
              />
            </div>

            <div className="form-group w-full !mb-5 relative">
              <TextField
                type={isPasswordShow === false ? "password" : "text"}
                id="password"
                name="password"
                value={formFields.password}
                disabled={isLoading === true ? true : false}
                label="Password *"
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[10px] right-[10px] !w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-black"
                onClick={() => {
                  setIsPasswordShow(!isPasswordShow);
                }}
              >
                {isPasswordShow === false ? (
                  <IoMdEye className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <a
              className="link cursor-pointer text-[14px] font-[500]"
              onClick={forgotPassword}
            >
              Forget Password?
            </a>

            <div className="flex items-center w-full !mt-3 !mb-3">
              <Button
                type="submit"
                disabled={!valideValue}
                className="btn-org btn-lg w-full !text-[15px] flex gap-3"
              >
                {isLoading === true ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            <p className="text-center !mb-3">
              Not Registered?{" "}
              <Link
                className="link text-[14px] font-[600] text-[#ff5252]"
                to="/register"
              >
                Sign Up
              </Link>
            </p>

            {/* <p className="text-center font-[500] !pt-4">
              Or continue with social account
            </p>
            <Button className="flex gap-2 w-full !bg-[#f1f1f1] !btn-lg !text-black !mb-5">
              <FcGoogle className="text-[20px]" />
              Login with Google
            </Button> */}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
