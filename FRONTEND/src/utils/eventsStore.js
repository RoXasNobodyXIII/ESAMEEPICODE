const KEY = 'public_events_store_v1';

export function listEvents() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveEvents(events) {
  localStorage.setItem(KEY, JSON.stringify(events || []));
}

export function upsertEvent(ev) {
  const events = listEvents();
  const idx = events.findIndex((e) => e.id === ev.id);
  if (idx >= 0) events[idx] = ev; else events.push(ev);
  saveEvents(events);
  return ev;
}

export function deleteEvent(id) {
  const events = listEvents().filter((e) => e.id !== id);
  saveEvents(events);
}

export function getEvent(id) {
  return listEvents().find((e) => String(e.id) === String(id));
}

export function generateId() {
  return `${Date.now()}-${Math.floor(Math.random()*1e6)}`;
}
