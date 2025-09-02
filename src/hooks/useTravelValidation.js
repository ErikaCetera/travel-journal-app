export const validateTravelForm = (travelData, stops) => {
  const newErrors = {};

  // Validazioni viaggio
  if (!travelData.title || travelData.title.length < 3) {
    newErrors.title = "Il titolo è obbligatorio e deve avere almeno 3 caratteri.";
  }

  if (!(travelData.cover instanceof File) && typeof travelData.cover !== "string") {
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
      newErrors[`stop_${index}_physical_effort`] = "Lo sforzo fisico deve essere tra 0 e 5.";
    }

    if (
      stop.economic_effort === "" ||
      isNaN(stop.economic_effort) ||
      stop.economic_effort < 0 ||
      stop.economic_effort > 5
    ) {
      newErrors[`stop_${index}_economic_effort`] = "Lo sforzo economico deve essere tra 0 e 5.";
    }

    if (!stop.media || stop.media.length === 0) {
      newErrors[`stop_${index}_media`] = "Devi caricare almeno un file multimediale.";
    }
  });

  return newErrors;
};
