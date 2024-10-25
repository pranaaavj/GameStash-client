export const loadState = () => {
  try {
    const serializedData = localStorage.getItem('redux');
    if (!serializedData) {
      return undefined;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.log('Error while loading state', error);
    return undefined;
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
