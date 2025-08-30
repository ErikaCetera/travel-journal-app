import { useState } from "react";
import { supabase } from "../supebaseClient";
import TravelForm from "../components/TravelForm";

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
};

function CreateTravel() {
  const [travelData, setTravelData] = useState({
    title: "",
    cover: "",
    start: "",
    end: "",
  });

  const [stops, setStops] = useState([]);
  const [showStopsSection, setShowStopsSection] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);



  const handleTravelChange = (e) => {
    setTravelData({ ...travelData, [e.target.name]: e.target.value });
  };

  const handleStopChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedStops = [...stops];
    updatedStops[index][name] = files ? Array.from(files) : value;
    setStops(updatedStops);
  };

  const handleShowStops = () => {
    setShowStopsSection(true);
    setStops([emptyStop]);
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

    // 1. Inserisci il viaggio
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

    // 2. Inserisci le tappe
    for (const stop of stops) {
      const { media, tags, ...stopData } = stop;

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

      // 3. Inserisci i media associati
      for (const file of media || []) {
        const { data: mediaData, error: mediaError } = await supabase
          .from("media")
          .insert([
            {
              travel_post_id: postId,
              url: file.url,
              type: file.type || "image",
            },
          ]);

        if (mediaError) {
          console.error("Errore nel salvataggio media:", mediaError);
        }
      }

      // 4. Gestione tag
      for (const tagName of tags || []) {
        let { data: tag } = await supabase
          .from("tag")
          .select("id")
          .eq("name", tagName)
          .single();

        if (!tag) {
          const { data: newTag, error: tagInsertError } = await supabase
            .from("tag")
            .insert([{ name: tagName }])
            .select()
            .single();

          if (tagInsertError) {
            console.error("Errore nel salvataggio del nuovo tag:", tagInsertError);
            continue;
          }

          tag = newTag;
        }

        await supabase.from("travel_post_tag").insert([
          {
            travel_post_id: postId,
            tag_id: tag.id,
          },
        ]);

      }
    }

    alert(" Viaggio salvato con successo!");
  };


  return (
    <div className="container my-3">
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
      />
    </div>
  );
}

export default CreateTravel;


