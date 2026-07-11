import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Monsoon Prep',
    short_name: 'Prep',
    description: 'A resilient monsoon preparedness companion',
    start_url: '/',
    display: 'standalone',
    background_color: '#07111f',
    theme_color: '#07111f',
    icons: [],
  };
}
