export const SITE = {
  name: "RN_ARCHITECT",
  whatsapp: "62895618133733",
  address: "Lampung, Indonesia",
  hours: "Senin – Sabtu, 09.00 – 18.00 WIB",
  // Reliable Pexels CDN sample (modern architecture). Replace anytime.
  heroVideo:
    "https://cdn.pixabay.com/video/2020/03/25/34147-401149497_large.mp4",
};

export function waLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Mark contact menu as opened (controls Login button visibility in Header). */
export const CONTACT_VISITED_KEY = "rn_contact_visited";
