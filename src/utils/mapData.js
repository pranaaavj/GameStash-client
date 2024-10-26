export const mapTableData = (data, headers) => {
  if (!data || data.length === 0 || !Array.isArray(data)) return [];

  return data.map((obj) => ({
    //for specific actions while listing
    id: obj?._id,
    isActive: obj?.isActive,

    // Mapping data with headers provided
    data: headers.map((header) => {
      const value = obj[header.toLowerCase()] || obj[header];

      //checking if the object is populated
      return typeof value === 'object' && value !== null ? value.name : value;
    }),
  }));
};

export const mapOptionsData = (data) => {
  if (!data || data.length === 0 || !Array.isArray(data)) return [];

  // Mapping according the options
  return data.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));
};
