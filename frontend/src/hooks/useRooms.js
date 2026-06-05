import { useState, useEffect, useMemo } from "react";
import { getRooms } from "../api/rooms";

const DEFAULT_FILTERS = {
    capacity: 0,
    maxPrice: 0,
    search: "",
};

export function useRooms() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [allRooms, setAllRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        
        getRooms()
            .then(rooms => {
                if (isMounted) {
                    setAllRooms(rooms);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error(err);
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredRooms = useMemo(() => {
        return allRooms.filter((room) => {
            if (filters.capacity && room.capacity < filters.capacity)
                return false;
            if (filters.maxPrice && room.pricePerHour > filters.maxPrice)
                return false;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (!room.name.toLowerCase().includes(q) &&
                    !room.location.toLowerCase().includes(q) &&
                    !room.address.toLowerCase().includes(q))
                    return false;
            }
            return true;
        });
    }, [allRooms, filters]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    return { rooms: filteredRooms, loading, error, filters, updateFilter, resetFilters };
}
