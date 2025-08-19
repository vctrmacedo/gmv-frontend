import api from "./axios";

export const listVehicles = () => api.get("/vehicles/");
export const createVehicle = (payload) => api.post("/vehicles/", payload);
export const updateVehicle = (id, payload) => api.put(`/vehicles/${id}`, payload);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);