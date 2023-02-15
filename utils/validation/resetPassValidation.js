const yup = require("yup");

exports.resetPassValidationSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    code: yup.string().max(10).required("Reset code is required"),
    newPassword: yup.string().min(5).max(255).required("Password is required"),
  }),
  // params: yup.object({
  //     id: yup.number().required(),
  // }),
});
