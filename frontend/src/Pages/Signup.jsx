import {  useState} from "react";
import axios from "../Axios/axios";
import { useDispatch } from "react-redux";
import { setUserDetails,setTokens } from "../Redux/Reducers/userReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";


function Signup() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
  
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
 
    username: "",
    email: "",
    phone: "",
    password: "",
  });


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };
 

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } 
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Invalid phone number format";
    }

    if (formData.password.length < 5) {
      errors.password = "Password must be at least 5 characters long";
    }
  
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {

        axios.post("/signup", formData).then((response) => {
            console.log(response.data);
         if (response?.data?.status === true) {

           localStorage.setItem("userAccessToken", response?.data?.token);
         
           dispatch(setUserDetails({ payload: response?.data?.UserData}));
           dispatch(setTokens({ payload: response?.data?.token}));

           toast.success("Registration successful!");
           navigate("/");
         } else{
           toast.error(response.data.message);
         }
       });

          }
        };

        

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
    <div className="bg-gray-800 p-4 rounded-lg shadow-md max-w-md w-full text-white">
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-2xl font-semibold">Signup</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-white"
              maxLength="15"
            />
            {formErrors.username && (
              <p className="text-red-500">{formErrors.username}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="text-gray-300">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-white"
            />
            {formErrors.email && (
              <p className="text-red-500">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="text-gray-300">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-white"
            />
            {formErrors.phone && (
              <p className="text-red-500">{formErrors.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-white"
            />
            {formErrors.password && (
              <p className="text-red-500">{formErrors.password}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full bg-[#06b6d4] text-white p-2 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
          >
            Sign Up
          </button>
        </div>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  </div>
 
  );
}

export default Signup;
