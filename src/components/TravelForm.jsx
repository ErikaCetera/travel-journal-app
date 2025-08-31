function TravelForm({
    travelData,
    stops,
    showStopsSection,
    handleTravelChange,
    handleStopChange,
    handleShowStops,
    handleAddStop,
    handleRemoveStop,
    availableTags,
    handleAddTag,
    errors,
    mode = "create",
    onSubmit 
}) {
    return (
        <div>
            <h1 className="text-center text-white my-4">
                {mode === "edit" ? "Modifica Viaggio" : "Nuovo Viaggio"}
            </h1>


            <div className="row justify-content-center">
                <div className="col-md-10">
                    <form className="travel-form" onSubmit={onSubmit}>
                        <div className="bg-section">

                            {/* Sezione Dati Viaggio */}
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <div className="form-group mb-4">
                                        <label htmlFor="title">Titolo <span className="red">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            value={travelData.title}
                                            onChange={handleTravelChange}
                                            placeholder="Es. Viaggio in Giappone"
                                        />
                                        {errors.title && <div className="red mt-1">{errors.title}</div>}
                                    </div>

                                    <div className="form-group mb-4">
                                        <label htmlFor="cover">Immagine di copertina <span className="red">*</span></label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="cover"
                                            name="cover"
                                            onChange={handleTravelChange}
                                        />
                                        {errors.cover && <div className="red mt-1">{errors.cover}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="start">Data inizio <span className="red">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="start"
                                        name="start"
                                        value={travelData.start}
                                        onChange={handleTravelChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="end">Data fine <span className="red">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="end"
                                        name="end"
                                        value={travelData.end}
                                        onChange={handleTravelChange}
                                    />
                                </div>

                                {errors.dates && <div className="red mt-2 ms-2">{errors.dates}</div>}
                            </div>

                        </div>


                        <hr />

                        {/* Bottone per mostrare la sezione */}
                        {!showStopsSection && (
                            <div className="text-center my-4">
                                <button type="button" className="btn btn-add-stop" onClick={handleShowStops}>
                                    + Aggiungi Meta
                                </button>
                            </div>
                        )}

                        {/* Sezione Meta */}
                        {showStopsSection && stops.map((stop, index) => (
                            <div key={index} className=" mb-4 bg-section ">
                                <div className="d-flex justify-content-between align-items-center mb-3 ">
                                    <h6 className="mb-0">Meta #{index + 1}</h6>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleRemoveStop(index)}
                                    >
                                        🗑 Rimuovi Meta
                                    </button>
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor={`place-${index}`}>Luogo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={`place-${index}`}
                                        name="place"
                                        value={stop.place}
                                        onChange={(e) => handleStopChange(index, e)}
                                        placeholder="Es. Kyoto"
                                    />
                                    {errors[`stop_${index}_place`] && (
                                        <div className="red mt-1">{errors[`stop_${index}_place`]}</div>)}
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor={`description-${index}`}>Descrizione</label>
                                    <textarea
                                        className="form-control"
                                        id={`description-${index}`}
                                        name="description"
                                        value={stop.description}
                                        onChange={(e) => handleStopChange(index, e)}
                                        placeholder="Descrivi la tappa"
                                    />
                                    {errors[`stop_${index}_description`] && (
                                        <div className="red mt-1">{errors[`stop_${index}_description`]}</div>)}
                                </div>

                                {/* Mood & Tag */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`mood-${index}`}>Mood</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`mood-${index}`}
                                            name="mood"
                                            value={stop.mood}
                                            onChange={(e) => handleStopChange(index, e)}
                                        />
                                        {errors[`stop_${index}_mood`] && (
                                            <div className="red mt-1">{errors[`stop_${index}_mood`]}</div>)}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Tag</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Scrivi un tag"
                                                list={`tag-suggestions-${index}`}
                                                value={stop.tagInput || ""}
                                                onChange={(e) =>
                                                    handleStopChange(index, {
                                                        target: { name: "tagInput", value: e.target.value },
                                                    })
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={() => {
                                                    const tagName = stop.tagInput?.trim();
                                                    if (!tagName) return;

                                                    handleAddTag(index, tagName);
                                                    handleStopChange(index, {
                                                        target: { name: "tagInput", value: "" },
                                                    });
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <datalist id={`tag-suggestions-${index}`}>
                                            {availableTags.map((tag) => (
                                                <option key={tag.id} value={tag.name} />
                                            ))}
                                        </datalist>

                                        {Array.isArray(stop.tags) && stop.tags.length > 0 && (
                                            <div className="mt-2">
                                                {stop.tags.map((tag, i) => (
                                                    <span key={i} className="badge-tag me-2">
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            className="btn-close btn-close-white btn-sm ms-1"
                                                            onClick={() => {
                                                                const updatedTags = stop.tags.filter((_, j) => j !== i);
                                                                handleStopChange(index, {
                                                                    target: { name: "tags", value: updatedTags },
                                                                });
                                                            }}
                                                        ></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Note positive & negative */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`positive_note-${index}`}>Note positive</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`positive_note-${index}`}
                                            name="positive_note"
                                            value={stop.positive_note}
                                            onChange={(e) => handleStopChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`negative_note-${index}`}>Note negative</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`negative_note-${index}`}
                                            name="negative_note"
                                            value={stop.negative_note}
                                            onChange={(e) => handleStopChange(index, e)}
                                        />
                                    </div>
                                </div>

                                {/* Sforzo fisico & economico */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`physical_effort-${index}`}>Sforzo fisico (0–5)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id={`physical_effort-${index}`}
                                            name="physical_effort"
                                            value={stop.physical_effort}
                                            onChange={(e) => handleStopChange(index, e)}
                                            min="0"
                                        />
                                        {errors[`stop_${index}_physical_effort`] && (
                                            <div className="red mt-1">{errors[`stop_${index}_physical_effort`]}</div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor={`economic_effort-${index}`}>Sforzo economico (0–5)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id={`economic_effort-${index}`}
                                            name="economic_effort"
                                            value={stop.economic_effort}
                                            onChange={(e) => handleStopChange(index, e)}
                                            min="0"
                                        />
                                        {errors[`stop_${index}_economic_effort`] && (
                                            <div className="red mt-1">{errors[`stop_${index}_economic_effort`]}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Costo effettivo */}
                                <div className="form-group mb-3">
                                    <label htmlFor={`actual_cost-${index}`}>Costo effettivo (€)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`actual_cost-${index}`}
                                        name="actual_cost"
                                        value={stop.actual_cost}
                                        onChange={(e) => handleStopChange(index, e)}
                                        step="0.01"
                                    />
                                </div>

                                {/* Media */}
                                <div className="form-group mb-3">
                                    <label htmlFor={`media-${index}`}>Media (immagini/video)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id={`media-${index}`}
                                        name="media"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={(e) => handleStopChange(index, e)}
                                    />
                                    {errors[`stop_${index}_media`] && (
                                        <div className="red mt-1">{errors[`stop_${index}_media`]}</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Bottone per aggiungere una nuova meta */}
                        {showStopsSection && (
                            <div className="text-center my-4">
                                <button type="button" className="btn btn-add-stop" onClick={handleAddStop}>
                                    + Aggiungi un'altra Meta
                                </button>
                            </div>
                        )}

                        <div className="text-center mt-4">
                            <button type="submit" className="btn btn-primary px-4 py-2">
                                Salva nel Diario
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TravelForm;
