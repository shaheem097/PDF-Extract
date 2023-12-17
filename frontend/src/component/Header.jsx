import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/Reducers/userReducer'; 
import { useNavigate } from 'react-router-dom';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function Header() {

  const username = useSelector((state) => state.user.userData.payload.username); 
  const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "Are you sure?",
          text: "To Logout!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Logout",
          cancelButtonText: "Cancel",
          customClass: {
            confirmButton: "btn bg-danger",
            cancelButton: "btn bg-success",
          },
        }).then((result) => {
          if (result.isConfirmed) {
           
     
    
          dispatch(logoutUser());
          
    
            navigate("/login");
          }
        });
      };

  return (
    <div className=" sticky  bg-gray-300 rounded-lg shadow p-4 m-2 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="/public/assets/pdflogo.png" alt="Logo" className="h-16 w-16" />

        <h1 className="text-2xl font-semibold font-serif font-bold">PDF Converter</h1>

      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-serif font-semibold">Hello {username}</span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
