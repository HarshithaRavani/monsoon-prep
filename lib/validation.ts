export function isValidCoordinates(latitude: number, longitude: number) {
  return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
    && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

export function normalizeLocationQuery(value: string | null) {
  const query = value?.trim() ?? '';
  return query.length >= 2 && query.length <= 100 ? query : null;
}

export function formatCoordinateLabel(latitude: number, longitude: number, label?: string) {
  return label?.trim() || `${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`;
}
