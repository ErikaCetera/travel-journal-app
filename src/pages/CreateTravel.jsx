import { useState } from "react";
import { supabase } from "../supebaseClient";
import TravelForm from "../components/TravelForm";
import { useNavigate } from "react-router-dom";
import GoBackButton from "../components/GoBackButton";


function CreateTravel() {
  const BUCKET_NAME = "media-travel-journal";
  const navigate = useNavigate();


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

  const validateForm = () => {
    const newErrors = {};

    // Validazioni viaggio
    if (!travelData.title || travelData.title.length < 3) {
      newErrors.title = "Il titolo è obbligatorio e deve avere almeno 3 caratteri.";
    }

    if (!(travelData.cover instanceof File)) {
      newErrors.cover = "Devi caricare un'immagine di copertina.";
    }

    if (!travelData.start || !travelData.end) {
      newErrors.dates = "Le date di inizio e fine sono obbligatorie.";
    } else if (new Date(travelData.end) < new Date(travelData.start)) {
      newErrors.dates = "La data di fine non può essere precedente a quella di inizio.";
    }

    // Validazioni tappe
    stops.forEach((stop, index) => {
      if (!stop.place) {
        newErrors[`stop_${index}_place`] = "Il luogo è obbligatorio.";
      }

      if (!stop.description || stop.description.length < 10) {
        newErrors[`stop_${index}_description`] = "La descrizione deve avere almeno 10 caratteri.";
      }

      if (!stop.mood) {
        newErrors[`stop_${index}_mood`] = "Il mood è obbligatorio.";
      }

      if (
        stop.physical_effort === "" ||
        isNaN(stop.physical_effort) ||
        stop.physical_effort < 0 ||
        stop.physical_effort > 5
      ) {
        newErrors[`stop_${index}_physical_effort`] = " deve essere tra 0 e 5.";
      }

      if (
        stop.economic_effort === "" ||
        isNaN(stop.economic_effort) ||
        stop.economic_effort < 0 ||
        stop.economic_effort > 5
      ) {
        newErrors[`stop_${index}_economic_effort`] = "deve essere tra 0 e 5.";
      }

      if (!stop.media || stop.media.length === 0) {
        newErrors[`stop_${index}_media`] = "Devi caricare almeno un file multimediale.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleTravelChange = (e) => {
    const { name, value, files } = e.target;
    setTravelData({
      ...travelData,
      [name]: files ? files[0] : value
    });
  };

  const handleStopChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedStops = [...stops];
    updatedStops[index][name] = files ? Array.from(files) : value;
    setStops(updatedStops);
  };

  const handleShowStops = () => {
    setShowStopsSection(true);
    setStops([{ ...emptyStop }]);
  };

  const handleAddStop = () => {
    setStops([...stops, { ...emptyStop }]);
  };

  const handleAddTag = (index, tagName) => {
    const updatedStops = [...stops];
    const currentTags = updatedStops[index].tags || [];

    if (!currentTags.includes(tagName)) {
      updatedStops[index].tags = [...currentTags, tagName];
      setStops(updatedStops);
    }
  };

  const handleRemoveStop = (index) => {
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
    if (updated.length === 0) setShowStopsSection(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //validazioni
    if (!validateForm()) {
      return;
    }
    // Carica la cover 
    if (travelData.cover instanceof File) {
      const fileName = `${Date.now()}_${travelData.cover.name}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, travelData.cover);

      if (uploadError) {
        console.error("Errore nel caricamento della cover:", uploadError);
        return;
      }

      const { data: publicCover } = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      travelData.cover = publicCover.publicUrl;
    }

    // Inserisce il viaggio
    const { data: travel, error: travelError } = await supabase
      .from("travel")
      .insert([travelData])
      .select()
      .single();

    if (travelError) {
      console.error("Errore nel salvataggio del viaggio:", travelError);
      return;
    }

    const travelId = travel.id;

    // Inserisce le tappe
    for (const stop of stops) {
      const { media, tags, tagInput, ...stopData } = stop;

      const { data: post, error: postError } = await supabase
        .from("travel_post")
        .insert([{ ...stopData, travel_id: travelId }])
        .select()
        .single();

      if (postError) {
        console.error("Errore nel salvataggio della tappa:", postError);
        continue;
      }

      const postId = post.id;

      // Carica i media nel bucket
      for (const file of media || []) {
        const fileName = `${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file);

        if (uploadError) {
          console.error("Errore nel caricamento del file nel bucket:", uploadError);
          continue;
        }

        const { data: publicMedia } = supabase
          .storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        const publicUrl = publicMedia.publicUrl;

        const { error: mediaError } = await supabase
          .from("media")
          .insert([
            {
              travel_post_id: postId,
              url: publicUrl,
              type: file.type || "image"
            }
          ]);

        if (mediaError && mediaError.code !== "23505") {
          console.error("Errore nel salvataggio media nel database:", mediaError);
        }
      }

      // Gestione tag
      for (const tagName of tags || []) {
        const normalizedTag = tagName.trim().toLowerCase();

        let { data: tag } = await supabase
          .from("tag")
          .select("id")
          .eq("name", normalizedTag)
          .single();

        if (!tag) {
          const { data: newTag, error: tagInsertError } = await supabase
            .from("tag")
            .insert([{ name: normalizedTag }])
            .select()
            .single();

          if (tagInsertError && tagInsertError.code !== "23505") {
            console.error("Errore nel salvataggio del nuovo tag:", tagInsertError);
            continue;
          }

          tag = newTag;
        }

        await supabase.from("travel_post_tag").insert([
          {
            travel_post_id: postId,
            tag_id: tag.id
          }
        ]);
      }
    }

    navigate(`/travel/${travelId}`);
  };

  return (
    <div className="container my-3">
      <GoBackButton/>

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
      />
    </div>
  );
}

export default CreateTravel;
