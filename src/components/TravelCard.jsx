import { Link } from 'react-router-dom';


const TravelCard = ({ travel }) => {
  return (
    <Link to={`/travel/${travel.id}`} className="travel-card-link">
      <div className="travel-card">
        <div
          className="travel-card-image"
          style={{ backgroundImage: `url(${travel.cover})` }}
        ></div>

        <div className="travel-card-body">
          <h3 className="travel-card-title">{travel.title}</h3>
        </div>
      </div>

    </Link>
  );
};

export default TravelCard;

