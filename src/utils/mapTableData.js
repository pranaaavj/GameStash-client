export const mapTableData = (data) => {
  if (!data || data.length < 1) return [];

  const keys = Object.keys(data[0]);

  return data.map((obj) => keys.map((key) => obj[key]));
};
