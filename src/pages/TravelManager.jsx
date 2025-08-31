import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supebaseClient";
import TravelForm from "../components/TravelForm";
import GoBackButton from "../components/GoBackButton";

function TravelManager() {
  const BUCKET_NAME = "media-travel-journal";
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const emptyStop = {
    place: "",
    description: "",
    mood: "",
    positive_note: "",
    negative_note: "",
    economic_effort: 0,
    physical_effort: 0,
    actual_cost: 0,
    media: [],
    tags: [],
    tagInput: ""
  };

  const [travelData, setTravelData] = useState({
    title: "",
    cover: "",
    start: "",
    end: ""
  });

  const [stops, setStops] = useState([]);
  const [showStopsSection, setShowStopsSection] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [errors, setErrors] = useState({});

  // Carica i dati del viaggio e delle tappe se siamo in modifica
  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        const { data: travel } = await supabase.from("travel").select("*").eq("id", id).single();
        const { data: stopsData } = await supabase.from("travel_post").select("*").eq("travel_id", id);
        const { data: tagsData } = await supabase.from("tag").select("*");

        setTravelData(travel);
        setStops(stopsData || []);
        setAvailableTags(tagsData || []);
        setShowStopsSection(true);
      }
    };

    fetchData();
  }, [id]);

  // Gestisce il cambiamento dei campi del viaggio
  const handleTravelChange = (e) => {
    const { name, value, files } = e.target;
    setTravelData({ ...travelData, [name]: files ? files[0] : value });
  };

  // Gestisce il cambiamento dei campi di una tappa
  const handleStopChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedStops = [...stops];
    updatedStops[index][name] = files ? Array.from(files) : value;
    setStops(updatedStops);
  };

  // Mostra la sezione tappe
  const handleShowStops = () => {
    setShowStopsSection(true);
    if (stops.length === 0) setStops([{ ...emptyStop }]);
  };

  // Aggiunge una nuova tappa
  const handleAddStop = () => {
    setStops([...stops, { ...emptyStop }]);
  };

  // Rimuove una tappa
  const handleRemoveStop = (index) => {
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
    if (updated.length === 0) setShowStopsSection(false);
  };

  // Aggiunge un tag a una tappa
  const handleAddTag = (index, tagName) => {
    const updatedStops = [...stops];
    const currentTags = updatedStops[index].tags || [];
    if (!currentTags.includes(tagName)) {
      updatedStops[index].tags = [...currentTags, tagName];
      setStops(updatedStops);
    }
  };

  // Salva il viaggio e le tappe (creazione o modifica)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Carica la cover se è un file
    if (travelData.cover instanceof File) {
      const fileName = `${Date.now()}_${travelData.cover.name}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, travelData.cover);
      if (uploadError) return console.error("Errore cover:", uploadError);
      const { data: publicCover } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
      travelData.cover = publicCover.publicUrl;
    }

    let travelId = id;

    // Inserisce o aggiorna il viaggio
    if (isEditMode) {
      const { error } = await supabase.from("travel").update(travelData).eq("id", id);
      if (error) return console.error("Errore aggiornamento viaggio:", error);
    } else {
      const { data, error } = await supabase.from("travel").insert([travelData]).select().single();
      if (error) return console.error("Errore creazione viaggio:", error);
      travelId = data.id;
    }

    // Inserisce o aggiorna le tappe
    for (const stop of stops) {
      const { id: stopId, media, tags, tagInput, ...stopData } = stop;

      let postId = stopId;

      if (stopId) {
        // Aggiorna tappa esistente
        await supabase.from("travel_post").update(stopData).eq("id", stopId);
      } else {
        // Inserisce nuova tappa
        const { data: newPost } = await supabase
          .from("travel_post")
          .insert([{ ...stopData, travel_id: travelId }])
          .select()
          .single();
        postId = newPost.id;
      }

      // Carica media
      for (const file of media || []) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);
        if (uploadError) continue;
        const { data: publicMedia } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
        await supabase.from("media").insert([{ travel_post_id: postId, url: publicMedia.publicUrl, type: file.type }]);
      }

      // Inserisce tag
      for (const tagName of tags || []) {
        const normalizedTag = tagName.trim().toLowerCase();
        let { data: tag } = await supabase.from("tag").select("id").eq("name", normalizedTag).single();
        if (!tag) {
          const { data: newTag } = await supabase.from("tag").insert([{ name: normalizedTag }]).select().single();
          tag = newTag;
        }
        await supabase.from("travel_post_tag").insert([{ travel_post_id: postId, tag_id: tag.id }]);
      }
    }

    navigate(`/travel/${travelId}`);
  };

  return (
    <div className="container my-3">
      <GoBackButton />
      <TravelForm
        travelData={travelData}
        stops={stops}
        showStopsSection={showStopsSection}
        handleTravelChange={handleTravelChange}
        handleStopChange={handleStopChange}
        handleShowStops={handleShowStops}
        handleAddStop={handleAddStop}
        handleRemoveStop={handleRemoveStop}
        handleSubmit={handleSubmit}
        availableTags={availableTags}
        handleAddTag={handleAddTag}
        errors={errors}
        mode={isEditMode ? "edit" : "create"}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default TravelManager;

