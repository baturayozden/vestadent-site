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

## 2. Team photography — `#team` "The team" section
Current placeholder: `/img/placeholder-portrait.svg` (5:6 portrait, 3 slots)

For **each** clinician we need:
- A professional **headshot** (portrait, min **1000×1200 px**), `team-[surname].jpg`
- **Full name** (as registered)
- **Role / area of focus** (e.g. Principal Dentist, Implant Surgeon, Treatment Coordinator)
- **GDC registration number** *(required for display — do not guess)*

> These map to the `[TODO: clinician name] / [TODO: role] / GDC No. [TODO]` fields
> in `index.html`. Add or remove member cards to match the actual team size.

## 3. Before / after cases (optional, high value)
- Real, **patient-consented** before/after photographs for the smile-design section.
- Each pair needs documented written consent and ideally consistent framing/lighting.
- Until supplied, the homepage keeps the illustrative CSS slider (labelled as such).

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
- Clinician **names + GDC numbers**
- Cancellation / missed-appointment policy and out-of-hours emergency arrangements
- Confirmation of operational claims in the homepage stats
  ("same-day temporaries milled in-house", "100% metal-free")
- Verified, attributed sources for the patient **reviews** (e.g. Google)
- Whether any **NHS** services are offered (affects the complaints route)
- Whether any data **processors transfer data internationally** (Privacy Policy)
