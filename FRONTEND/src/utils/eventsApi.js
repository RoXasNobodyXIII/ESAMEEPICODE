import api from '../api';

export async function listEvents(includeAll = false) {
  const { data } = await api.get('/events', { params: { includeAll } });
  return Array.isArray(data) ? data : [];
}

export async function getEvent(id) {
  const { data } = await api.get(`/events/${id}`);
  return data;
}

export async function createEvent(payload) {
  const { data } = await api.post('/events', payload);
  return data;
}

export async function updateEvent(id, payload) {
  const { data } = await api.put(`/events/${id}` , payload);
  return data;
}

export async function deleteEvent(id) {
  const { data } = await api.delete(`/events/${id}`);
  return data;
}
