import axios from "./axios";

export const listDrivers = () => axios.get("/drivers");
export const createDriver = (payload) => axios.post("/drivers", payload);
export const updateDriver = (id, payload) => axios.put(`/drivers/${id}`, payload);
export const deleteDriver = (id) => axios.delete(`/drivers/${id}`);
