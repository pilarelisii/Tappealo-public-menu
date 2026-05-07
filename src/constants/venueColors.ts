export type VenueColors = {
  color_text: string;
  color_background: string;
  color_foreground: string;
  color_primary: string;
};

export const DEFAULT_VENUE_COLORS: VenueColors = {
  color_text: "#111827",
  color_background: "#FFFFFF",
  color_foreground: "#F9FAFB",
  color_primary: "#111827",
};

export function getVenueColors(venue?: Partial<VenueColors>): VenueColors {
  return {
    color_text: venue?.color_text || DEFAULT_VENUE_COLORS.color_text,
    color_background: venue?.color_background || DEFAULT_VENUE_COLORS.color_background,
    color_foreground: venue?.color_foreground || DEFAULT_VENUE_COLORS.color_foreground,
    color_primary: venue?.color_primary || DEFAULT_VENUE_COLORS.color_primary,
  };
}