import type { Product } from "../types";
import { apiGet } from "./client";

export async function getProductsByVenue(venueId: string) {
  return apiGet<Product[]>(`/products?venueId=${encodeURIComponent(venueId)}`);
}