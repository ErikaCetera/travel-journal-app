import { useState, useEffect } from "react";
import { supabase } from "../supebaseClient";

export const useTravelFormHandlers = (initialStops = []) => {
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

  const [stops, setStops] = useState(initialStops);
  const [showStopsSection, setShowStopsSection] = useState(initialStops.length > 0);
  const [travelData, setTravelData] = useState({
    title: "",
    cover: "",
    start: "",
    end: ""
  });
  const [availableTags, setAvailableTags] = useState([]);

  // Gestisce i campi del viaggio
  const handleTravelChange = (e) => {
    const { name, value, files } = e.target;
    setTravelData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Gestisce i campi di una tappa
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

  // Carica i tag disponibili da Supabase
  const fetchAvailableTags = async () => {
    const { data, error } = await supabase.from("tag").select("*");
    if (!error) setAvailableTags(data || []);
  };

  // Reset tappe e sezione
  const resetStops = () => {
    setStops([]);
    setShowStopsSection(false);
  };

  return {
    emptyStop,
    travelData,
    setTravelData,
    availableTags,
    fetchAvailableTags,
    stops,
    setStops,
    showStopsSection,
    handleTravelChange,
    handleStopChange,
    handleShowStops,
    handleAddStop,
    handleRemoveStop,
    handleAddTag,
    resetStops
  };
};
