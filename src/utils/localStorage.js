export const loadState = () => {
  try {
    const serializedData = localStorage.getItem('redux');
    if (!serializedData) {
      return;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.log('Error while loading state', error);
    return;
  }
};

export const saveState = (state) => {
  try {
    const serializedData = JSON.stringify(state);
    localStorage.setItem('redux', serializedData);
  } catch (error) {
    console.log('Error while loading state', error);
    return;
  }
};
