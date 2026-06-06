import { apiClient } from './client';
import { normalizeRoom } from '../utils/normalize';

export async function getRooms() {
    try {
        const res = await apiClient('/rooms');
        return (res.data?.rooms || []).map(r => normalizeRoom(r));
    } catch (error) {
        console.error("Failed to fetch rooms", error);
        throw error;
    }
}

export async function getRoomById(id) {
    try {
        const res = await apiClient(`/rooms/${id}`);
        return res.data?.room;
    } catch (error) {
        console.error(`Failed to fetch room ${id}`, error);
        throw error;
    }
}

export async function createRoom(payload) {
    const backendPayload = {
        name: payload.name,
        location: payload.location,
        address: payload.address,
        type: payload.type,
        capacity: Number(payload.capacity),
        price_per_hour: Number(payload.pricePerHour),
        description: payload.description,
        facilities: payload.facilities,
        min_hours: Number(payload.minHours),
        open_time: payload.operationalHours?.open || "08:00",
        close_time: payload.operationalHours?.close || "22:00",
        images: payload.images
    };

    return apiClient('/rooms', {
        method: 'POST',
        data: backendPayload
    });
}

export async function updateRoom(id, payload) {
    const backendPayload = {
        name: payload.name,
        location: payload.location,
        address: payload.address,
        type: payload.type,
        capacity: Number(payload.capacity),
        price_per_hour: Number(payload.pricePerHour),
        description: payload.description,
        facilities: payload.facilities || [],
        min_hours: Number(payload.minHours),
        open_time: payload.operationalHours?.open || "08:00",
        close_time: payload.operationalHours?.close || "22:00",
        images: payload.images
    };

    return apiClient(`/rooms/${id}`, {
        method: 'PUT',
        data: backendPayload
    });
}

export async function deleteRoom(id) {
    return apiClient(`/rooms/${id}`, {
        method: 'DELETE'
    });
}
