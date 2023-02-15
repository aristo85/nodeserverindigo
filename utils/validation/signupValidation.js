const yup = require("yup");

exports.singupValidationSchema = yup.object({
    body: yup.object({
        username: yup.string().min(3).max(32).required(),
        email: yup.string().email('Must be a valid email')
            .max(255).required('Email is required'),
        password: yup.string().min(5).max(255).required('Password is required'),
        birthdate: yup.date().required('Birth date is required'),
        gender: yup.string().oneOf(["male", "female"]).required(),
    }),
    // params: yup.object({
    //     id: yup.number().required(),
    // }),
});
