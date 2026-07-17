const store = {
  inquiries: [],
  reservations: [],
  appInterests: []
};

export function saveMemory(collection, payload) {
  const record = {
    _id: `${collection}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...payload
  };

  store[collection].push(record);
  return record;
}

export function listMemory(collection) {
  return store[collection];
}
