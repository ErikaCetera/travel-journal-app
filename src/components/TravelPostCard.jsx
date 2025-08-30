import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const TravelPostCard = ({ post, media, open, toggle, tags = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const currentMedia = media[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const CirclesDisplay = ({ voto }) => (
    <div className="rating-circles">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`circle ${i < voto ? "filled" : ""}`}></span>
      ))}
    </div>
  );

  return (
    <div className="mb-5 row bg-section mx-1">

      <div className="travel-post-header d-flex align-items-center mb-3">
          <FaMapMarkerAlt className="text-primary me-2" />
          <h3 className="travel-post-title">{post.place}</h3>
        </div>
        <hr  className="text-white"/>

      {/* galleria media */}
      <div className="col-md-5">
        {media && media.length > 0 && (
          <div className="media-viewer position-relative">
            {currentMedia.type === "video" ? (
              <video src={currentMedia.url} controls className="media-item w-100" />
            ) : (
              <img src={currentMedia.url} alt="Foto tappa" className="media-item w-100" />
            )}

            {media.length > 1 && (
              <div className="media-controls d-flex justify-content-between mt-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={handlePrev}>‹</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleNext}>›</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* dettagli */}
      <div className="col-md-7">
        {tags.length > 0 && (
          <div className="travel-tags mb-2">
            {tags.map((tag, i) => (
              <span key={i} className="badge-tag">{tag}</span>
            ))}
          </div>
        )}

        <p className="travel-description mt-1">{post.description}</p>

        <button
          className="btn btn-sm btn-outline-primary mt-3"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Nascondi dettagli" : "Mostra dettagli"}
        </button>

        {showDetails && (
          <ul className="list-unstyled travel-details mt-3">
            <li><strong>Mood:</strong> {post.mood}</li>
            <li><strong>Note positive:</strong> {post.positive_note}</li>
            <li><strong>Note negative:</strong> {post.negative_note}</li>
            <li><strong>Sforzo fisico:</strong> <CirclesDisplay voto={post.physical_effort} /></li>
            <li><strong>Effert economico:</strong> <CirclesDisplay voto={post.economic_effort} /></li>
            <li><strong>Costo reale:</strong> €{post.actual_cost}</li>
          </ul>
        )}
      </div>
    </div>

  );
};

export default TravelPostCard;

