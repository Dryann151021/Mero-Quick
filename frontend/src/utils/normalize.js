export function normalizeRoom(data) {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    location: data.location,
    address: data.address,
    capacity: data.capacity,
    pricePerHour: data.price_per_hour,
    description: data.description,
    facilities: data.facilities || [],
    minHours: data.min_hours,
    operationalHours: {
      open: data.open_time,
      close: data.close_time,
    },
    images: data.images,
  };
}
