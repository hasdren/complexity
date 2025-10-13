fields.forEach((field) => {
  if (updates[field] !== undefined) {
    user[field] = updates[field];
  }
});