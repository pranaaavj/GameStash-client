export const mapTableData = (data, headers) => {
  if (!data || data.length === 0 || !Array.isArray(data)) return [];

  return data.map((obj) => ({
    id: obj._id,
    isActive: obj.isActive,
    data: headers.map((header) => obj[header.toLowerCase()] || obj[header]),
  }));
};

export const mapOptionsData = (data) => {
  if (!data || data.length === 0 || !Array.isArray(data)) return [];

  return data.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));
};
