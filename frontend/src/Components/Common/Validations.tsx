import { MOBILE_NUM_REGEX } from 'constants/commonConstants';
import * as Yup from 'yup'

const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

export const SignupValidation = Yup.object({
    name: Yup.string().min(3).required("Please Enter name"),
    email: Yup.string().email("Please Enter Valid Email").required("please Enter Email"),
    phone: Yup.string().matches(MOBILE_NUM_REGEX, "Enter a valid Phone number").min(10).max(10).required("Please Enter Phone number"),
    location: Yup.string().min(3).required("please Enter the location!"),
    password: Yup.string().matches(strongRegex, "Enter a Strong password").min(5).required("please Enter password!"),
    cpassword: Yup.string().oneOf([Yup.ref("password")], "Password not matching").required("please Enter the confirm password!"),
    role: Yup.string().required("please Select the role!"),
})