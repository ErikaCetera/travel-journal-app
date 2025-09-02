import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supebaseClient";
import TravelForm from "../components/TravelForm";
import { useTravelFormHandlers } from "../hooks/useTravelFormHandlers";
import { validateTravelForm } from "../hooks/useTravelValidation";

function TravelEdit() {
    const { id } = useParams();
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

    // Carica i dati del viaggio e delle tappe
    useEffect(() => {
        const fetchData = async () => {
            const { data: travel } = await supabase.from("travel").select("*").eq("id", id).single();
            const { data: stopsData } = await supabase.from("travel_post").select("*").eq("travel_id", id);
            await fetchAvailableTags();
            console.log("Tappe caricate:", stopsData);

            if (travel) {
                setTravelData(travel);

                if (stopsData && stopsData.length > 0) {
                    const postIds = stopsData.map((s) => s.id);
                    const { data: mediaData } = await supabase
                        .from("media")
                        .select("*")
                        .in("travel_post_id", postIds);

                    // Associa i media alle tappe
                    const enrichedStops = (stopsData || []).map((stop) => ({
                        ...stop,
                        tags: stop.tags || [],
                        tagInput: "",
                        media: []
                    }));

                    setStops(enrichedStops);

                    setStops(enrichedStops);
                    handleShowStops();
                } else {
                    setStops([]);
                }
            }
        };

        fetchData();
    }, [id]);


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

        // Carica la cover se modificata
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

        // Aggiorna il viaggio
        const { error } = await supabase.from("travel").update(updatedTravelData).eq("id", id);
        if (error) {
            console.error("Errore aggiornamento viaggio:", error);
            setErrors({ submit: "Errore durante la modifica del viaggio" });
            return;
        }

        // Aggiorna o inserisce le tappe
        for (const stop of stops) {
            const { id: stopId, media, tags, tagInput, ...stopData } = stop;
            let postId = stopId;

            if (stopId) {
                await supabase.from("travel_post").update(stopData).eq("id", stopId);
            } else {
                const { data: newPost } = await supabase
                    .from("travel_post")
                    .insert([{ ...stopData, travel_id: id }])
                    .select()
                    .single();
                postId = newPost.id;
            }

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

        navigate(`/travel/${id}`);
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
            mode="edit"
            onSubmit={handleSubmit}
        />
    );
}

export default TravelEdit;
