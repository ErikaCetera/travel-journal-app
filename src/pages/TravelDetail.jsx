import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supebaseClient";
import TravelPostCard from "../components/TravelPostCard";
import GoBackButton from "../components/GoBackButton";

const TravelDetails = () => {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [media, setMedia] = useState([]);
  const [openPostId, setOpenPostId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filtri
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: travelData } = await supabase
        .from("travel")
        .select("*")
        .eq("id", id)
        .single();

      const { data: postsData } = await supabase
        .from("travel_post")
        .select("*")
        .eq("travel_id", id)
        .order("created_at", { ascending: true });

      const { data: mediaData } = await supabase
        .from("media")
        .select("*")
        .in("travel_post_id", postsData.map((p) => p.id));

      const { data: tagData } = await supabase.from("tag").select("*");

      setTravel(travelData);
      setPosts(postsData);
      setFilteredPosts(postsData);
      setMedia(mediaData || []);
      setTags(tagData || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const fetchPostsByTag = async (tagId) => {
    const { data: tagLinks } = await supabase
      .from("travel_post_tag")
      .select("travel_post_id")
      .eq("tag_id", tagId);

    const postIds = tagLinks.map((link) => link.travel_post_id);
    return posts.filter((p) => postIds.includes(p.id));
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    let filtered = [...posts];

    if (text) {
      const lowerText = text.toLowerCase();
      filtered = filtered.filter((p) =>
        p.place.toLowerCase().includes(lowerText) ||
        p.description?.toLowerCase().includes(lowerText)
      );
    }

    if (mood) {
      filtered = filtered.filter((p) =>
        p.mood?.toLowerCase().includes(mood.toLowerCase())
      );
    }

    if (selectedTag) {
      const filteredByTag = await fetchPostsByTag(selectedTag);
      filtered = filtered.filter((p) => filteredByTag.includes(p));
    }

    setFilteredPosts(filtered);
  };

  return (
    <div className="container mt-4">

      <GoBackButton/>

      {/* Copertina */}
      {travel && (
        <div className="travel-header mb-4">
          <img src={travel.cover} alt="Copertina viaggio" className="travel-cover" />
          <h1 className="travel-title">{travel.title}</h1>
        </div>
      )}

      {/* Filtri */}
      <div className="bg-section my-5">
        <h5 className="filters-title">Filtra</h5>
        <form onSubmit={handleFilter}>
          <div className="filters-row">
            <div className="filter-group">
              <input
                type="text"
                className="filter-input"
                placeholder="Luogo o descrizione"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <input
                type="text"
                className="filter-input"
                placeholder="Mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <input
                type="text"
                className="filter-input"
                placeholder="Tag"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <button type="submit" className="filter-btn filter-btn-search">
                Cerca
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista tappe */}
      {loading ? (
        <p>Caricamento tappe...</p>
      ) : filteredPosts.length === 0 ? (
        <p>Nessuna tappa registrata per questo viaggio.</p>
      ) : (
        <div className="row">
          {filteredPosts.map((post) => (
            <TravelPostCard
              key={post.id}
              post={post}
              media={media.filter((m) => m.travel_post_id === post.id)}
              open={openPostId === post.id}
              toggle={() =>
                setOpenPostId(openPostId === post.id ? null : post.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelDetails;


