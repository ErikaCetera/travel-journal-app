import { Link } from 'react-router-dom';
import '../TravelCard.css';

const TravelCard = ({ travel }) => {
  return (
    <Link to={`/travel/${travel.id}`} className="travel-card-link">
      <div className="travel-card">
        <div
          className="travel-card-bg"
          style={{ backgroundImage: `url(${travel.cover})` }}
        >
          <h3 className="travel-card-title">{travel.title}</h3>
          <div className="travel-card-overlay"></div>
        </div>
      </div>
    </Link>
  );
};

export default TravelCard;

