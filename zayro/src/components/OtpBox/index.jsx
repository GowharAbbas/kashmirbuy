import React, { useState, useEffect } from "react";

const OtpBox = ({ length, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return; // Only digits allowed

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Auto-focus next input
    if (value && index < length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // 👇 Focus first input when component mounts
  useEffect(() => {
    const firstInput = document.getElementById("otp-input-0");
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  return (
    <div className="otpBox flex items-center gap-2 justify-center mt-4">
      {otp.map((data, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength="1"
          value={otp[index]}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="!w-[45px] !h-[45px] text-[17px] text-center border rounded"
        />
      ))}
    </div>
  );
};

export default OtpBox;
