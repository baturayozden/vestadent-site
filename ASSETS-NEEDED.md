# Vestadent — Real photography & assets needed

The site currently uses **neutral placeholders** wherever a real photo should go.
Replace each placeholder with a genuine photograph of **this** clinic / team.

> **Rules (non-negotiable):**
> - **No AI-generated** images of people, patients, results or premises.
> - **No stock photos** of people/teams/patients — visitors must not be misled.
> - Before/after and patient images require **written patient consent** on file.
> - The 3D implant render and the CSS before/after illustration on the homepage
>   are clearly illustrative and **stay as they are** until real cases are ready.

When supplying files, drop them in `/img/` and tell us the filename so we can wire
them in (or replace the matching placeholder `src`). Provide the **largest** version
you have; we will compress and resize.

---

## 1. Practice photography — `#practice` "Inside the practice" section
Current placeholder: `/img/placeholder-landscape.svg` (4:3, 4 slots)

| Slot | Photo needed | Suggested filename | Notes |
|------|--------------|--------------------|-------|
| 1 | **Clinic exterior** on Church Lane, with signage | `practice-exterior.jpg` | Daytime, straight-on if possible |
| 2 | **Reception / waiting area** | `practice-reception.jpg` | Tidy, lights on, no patients unless consented |
| 3 | **Treatment room / surgery** | `practice-treatment-room.jpg` | Clean, equipment visible |
| 4 | **3D imaging / scanning equipment** | `practice-imaging.jpg` | CBCT, intraoral scanner, or mill |

Target: landscape, min **1600×1200 px**, JPG.

> Each of the 9 `/treatments/*` pages also has an **"At the practice" photo slot**
> (16:9, currently `/img/placeholder-landscape.svg`) for a real clinic/equipment
> photo. The hero visuals there are deliberately illustrative (3D / schematic SVG) —
> **do not** fill these slots with stock or AI imagery; consented real photos only.

## 2. Before / after cases — `#smile` "Before & after" gallery
Current images: `/img/before-after/case-01.jpg … case-12.jpg` (12 cases, 600×900).

- These are **real cases from the wider clinic group (Dentafly)**, downloaded from
  dentafly.com and optimised for web. They are labelled on-page as "cases from our
  clinic group" — **not** presented as Vestadent London's own work.
- **[TODO] Confirm written patient consent** covers republication on vestadent.co.uk.
- **[TODO] ASA/GDC check:** ensure the gallery is genuine, representative and not
  misleading. Remove any case without documented consent.
- To add genuine **Vestadent London** cases later: drop consented 600×900 (2:3)
  images into `/img/before-after/` and add `<figure class="ba-case">` entries.

## 3. Reviews — Trustpilot (`#reviews`)
- The section uses the **official Trustpilot TrustBox widget** (live, not scraped).
- **[TODO] Business Unit ID:** set `data-businessunit-id` on the widget from the
  clinic group's **Trustpilot Business** account, and confirm the review URL.

## 4. Social share image — `/img/og-image.png`
- A branded share card (1200×630) has been **generated** and is in place.
- Optional: replace with a photographic version once real practice imagery exists.

## 5. Logo / brand
- Logo (`/logo.png`) was extracted from the original homepage and reused for the
  favicon, apple-touch-icon and OG card. Supply a **vector (SVG)** master if available
  for crisper rendering.

---

## Content still required (text / facts — see `[TODO]` markers in the code)
These are **not images** but are needed before the legal pages and schema go live:

- **Vestadent Limited** company registration number + registered office address
- **ICO** registration number
- **Data protection contact** (name/role) for the Privacy Policy
- **Complaints Manager** name + acknowledgement/response timescales
- **priceRange** and **geo coordinates** for the homepage `Dentist` schema (JSON-LD)
- Cancellation / missed-appointment policy and out-of-hours emergency arrangements
- Confirmation of operational claims in the homepage stats
  ("same-day temporaries milled in-house", "100% metal-free")
- **Trustpilot Business Unit ID** for the reviews widget (clinic group account)
- Written **patient consent** confirmation for the before/after gallery
- Whether any **NHS** services are offered (affects the complaints route)
- Whether any data **processors transfer data internationally** (Privacy Policy)
