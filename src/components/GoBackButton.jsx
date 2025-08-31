import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button className={`go-back-btn mb-2`} onClick={() => navigate(-1)}>
      <FaArrowLeft className="go-back-icon" />
    </button>
  );
};

export default GoBackButton;
