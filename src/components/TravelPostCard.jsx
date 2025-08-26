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
    <div className="travel-post-full mb-5">
      {/* Luogo */}
      <div className="travel-post-header">
        <FaMapMarkerAlt className="text-danger me-2" />
        <h3 className="travel-post-title">{post.place}</h3>
      </div>

      {/* Media singolo con freccette */}
      {media && media.length > 0 && (
        <div className="media-viewer">
          {currentMedia.type === "video" ? (
            <video src={currentMedia.url} controls className="media-item" />
          ) : (
            <img src={currentMedia.url} alt="Foto tappa" className="media-item" />
          )}
          {media.length > 1 && (
            <>
              <button className="media-arrow left" onClick={handlePrev}>‹</button>
              <button className="media-arrow right" onClick={handleNext}>›</button>
            </>
          )}
        </div>
      )}

      {/* Descrizione + tag */}
      <div className="travel-post-body">
        {tags.length > 0 && (
          <div className="travel-tags">
            {tags.map((tag, i) => (
              <span key={i} className="badge-tag">{tag}</span>
            ))}
          </div>
        )}
        <p className="travel-description">{post.description}</p>

        {/* Dettagli toggle */}
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
            <li><strong>Sforzo economico:</strong> <CirclesDisplay voto={post.economic_effort} /></li>
            <li><strong>Costo reale:</strong> €{post.actual_cost}</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default TravelPostCard;

