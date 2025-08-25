import React, { useEffect, useState } from 'react';
import { supabase } from '../supebaseClient';

const TravelList = () => {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTravels = async () => {
            const { data, error } = await supabase
                .from('travel')
                .select('*')
                .order("start");

            if (error) {
                console.error('Errore nel recupero dei viaggi:', error.message);
            } else {
                setTravels(data);
            }
            setLoading(false);
        };

        fetchTravels();
    }, []);

    if (loading) return <p>Caricamento viaggi...</p>;

    return (
        <div>
            <h2>Lista Viaggi</h2>
            {travels.length === 0 ? (
                <p>Nessun viaggio trovato.</p>
            ) : (
                <ul>
                    {travels.map((trip) => (
                        <li key={trip.id}>
                            <strong>{trip.title}</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TravelList;
