import { useEffect, useState } from "react";
import { supabase } from "../supebaseClient";
import TravelCard from "../components/TravelCard";

const TravelList = () => {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [start, setStart] = useState("");
    const [title, setTitle] = useState("");


    const fetchAllTravels = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("travel")
            .select("*")
            .order("start");

        if (error) {
            console.error("Errore nel caricamento iniziale:", error.message);
            setTravels([]);
        } else {
            setTravels(data);
        }

        setLoading(false);
    };


    const fetchFilteredTravels = async () => {
        setLoading(true);
        let query = supabase.from("travel").select("*");

        if (start) {
            query = query.gte("start", start);
        }

        if (title) {
            query = query.ilike("title", `%${title}%`);
        }

        query = query.order("start");

        const { data, error } = await query;

        if (error) {
            console.error("Errore nella ricerca filtrata:", error.message);
            setTravels([]);
        } else {
            setTravels(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchAllTravels();
    }, []);

    return (
        <div className="container mt-4">

            {/* Filtri */}
            <div className="bg-section mb-5">
                <h5 className="filters-title">Filtra</h5>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchFilteredTravels();
                    }}
                >
                    <div className="filters-row">
                        <div className="filter-group ">
                            <input
                                type="text"
                                className="filter-input"
                                placeholder="Titolo viaggio"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="filter-group ">
                            <input
                                type="date"
                                className="filter-input"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <button type="submit"
                                className="filter-btn filter-btn-search">
                                Cerca
                            </button>
                        </div>
                        <div className="filter-group">
                            <button
                                type="button"
                                className="filter-btn filter-btn-reset"
                                onClick={() => {
                                    setStart("");
                                    setTitle("");
                                    fetchAllTravels();
                                }}>
                                Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Lista viaggi */}
            {loading ? (
                <p>Caricamento viaggi...</p>
            ) : travels.length === 0 ? (
                <p>Nessun viaggio trovato.</p>
            ) : (
                <div className="row">
                    {travels.map((travel) => (
                        <div className="col-md-4 mb-4" key={travel.id}>
                            <TravelCard travel={travel} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TravelList;


