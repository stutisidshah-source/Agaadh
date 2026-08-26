export const validateSampleContext = (lat: number, lon: number, depth: number, temp: number) => {
  const errors: { lat?: string; lon?: string; depth?: string; temp?: string } = {};
  
  if (isNaN(lat) || lat < -90 || lat > 90) errors.lat = 'Must be between -90 and 90';
  if (isNaN(lon) || lon < -180 || lon > 180) errors.lon = 'Must be between -180 and 180';
  if (isNaN(depth) || depth <= 0) errors.depth = 'Must be positive';
  if (isNaN(temp) || temp < -5 || temp > 40) errors.temp = 'Valid range: -5 to 40';

  return errors;
};
