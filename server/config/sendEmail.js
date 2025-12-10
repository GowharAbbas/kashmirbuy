// import { sendEmail } from "./emailservice.js";

// const sendEmailFun = async(to, subject, text, html) => {
//   const result = await sendEmail(to, subject, text, html);
//   if(result.success){
//     return true;
//   }else{
//     return false;
//   }
// }

// export default sendEmailFun;





import { sendEmail } from "./emailService.js";

const sendEmailFun = async ({ sendTo, subject, text, html }) => {
  const result = await sendEmail(sendTo, subject, text, html);
  return result.success;
}

export default sendEmailFun;