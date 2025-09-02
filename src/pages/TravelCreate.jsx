import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supebaseClient";
import TravelForm from "../components/TravelForm";
import { useTravelFormHandlers } from "../hooks/useTravelFormHandlers";
import { validateTravelForm } from "../hooks/useTravelValidation";

function TravelCreate() {
  const navigate = useNavigate();
  const BUCKET_NAME = "media-travel-journal";

  const {
    travelData,
    setTravelData,
    stops,
    setStops,
    showStopsSection,
    handleTravelChange,
    handleStopChange,
    handleShowStops,
    handleAddStop,
    handleRemoveStop,
    handleAddTag,
    availableTags,
    fetchAvailableTags
  } = useTravelFormHandlers();

  const [errors, setErrors] = useState({});

  // Carica i tag disponibili
  useEffect(() => {
    fetchAvailableTags();
  }, []);

  // Gestisce il submit del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateTravelForm(travelData, stops);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let updatedTravelData = { ...travelData };

    // Carica la cover se è un file
    if (updatedTravelData.cover instanceof File) {
      const fileName = `${Date.now()}_${updatedTravelData.cover.name}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, updatedTravelData.cover);
      if (uploadError) return console.error("Errore cover:", uploadError);
      const { data: publicCover } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);
      updatedTravelData.cover = publicCover.publicUrl;
    }

    // Inserisce il viaggio
    const { data, error } = await supabase
      .from("travel")
      .insert([updatedTravelData])
      .select()
      .single();

    if (error) {
      console.error("Errore creazione viaggio:", error);
      setErrors({ submit: "Errore durante la creazione del viaggio" });
      return;
    }

    const travelId = data.id;

    // Inserisce le tappe
    for (const stop of stops) {
      const { media, tags, tagInput, ...stopData } = stop;
      const { data: newPost } = await supabase
        .from("travel_post")
        .insert([{ ...stopData, travel_id: travelId }])
        .select()
        .single();

      const postId = newPost.id;

      // Carica media
      for (const file of media || []) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file);
        if (uploadError) continue;
        const { data: publicMedia } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);
        await supabase.from("media").insert([
          { travel_post_id: postId, url: publicMedia.publicUrl, type: file.type }
        ]);
      }

      // Inserisce tag
      for (const tagName of tags || []) {
        const normalizedTag = tagName.trim().toLowerCase();
        let { data: tag } = await supabase
          .from("tag")
          .select("id")
          .eq("name", normalizedTag)
          .single();
        if (!tag) {
          const { data: newTag } = await supabase
            .from("tag")
            .insert([{ name: normalizedTag }])
            .select()
            .single();
          tag = newTag;
        }
        await supabase.from("travel_post_tag").insert([
          { travel_post_id: postId, tag_id: tag.id }
        ]);
      }
    }

    navigate(`/travel/${travelId}`);
  };

  return (
    <TravelForm
      travelData={travelData}
      stops={stops}
      showStopsSection={showStopsSection}
      handleTravelChange={handleTravelChange}
      handleStopChange={handleStopChange}
      handleShowStops={handleShowStops}
      handleAddStop={handleAddStop}
      handleRemoveStop={handleRemoveStop}
      handleAddTag={handleAddTag}
      availableTags={availableTags}
      errors={errors}
      mode="create"
      onSubmit={handleSubmit}
    />
  );
}

export default TravelCreate;

