# Source register and provenance convention

## Supplied documents

| Source ID | File | Pages | SHA-256 | Authority |
|---|---|---:|---|---|
| `aid-v3.2` | `references/Solo_Player_Aid_Combi_V3.2.pdf` | 21 | `7ec5e40bbd1c242325ef62427b659bb2b8e53a38c27873c14f2cce76415b0397` | Primary solo content and wording |
| `rules` | `references/Rules.pdf` | 48 | `29fdc157234951b517190c82298ea578a543d25f183224e9fa86c1ca8c470dd0` | Base-rule structure, multiplayer restoration, scenario context |
| `crown-handbook` | `references/Crown Handbook.pdf` | 16 | `2001e4b7547a239e7b788fbd9da6436afe37d9610c7ee067ac37ef7ecf2d8728` | Crown behavior and 2P differences |

PDF ordinal and printed page number agree in all three supplied files. Page citations in the source-analysis artifacts therefore use the visible printed page number.

The aid states that version 3 incorporates changes proposed by Ricky Royal and links to a BoardGameGeek thread. The user designated the aid as primary; its integrated rules are authoritative for this app even when the older auxiliary books differ. The linked thread is provenance context, not a fourth independent rule source in this session.

## Reference application

- Live: <https://the-crown-81cb9.web.app/handbook>
- Source: <https://github.com/dkrees/crown-app>
- Audited commit: `d82543ad9cdca08f707c75270a93bbecdc1c8853`

Verified behavior:

- It exposes fast phase arrows and a persistent five-climate control.
- It filters a flat phase document by climate and solo/2P mode.
- `actingPlayer` changes styling only; human and Crown sections remain visible together.
- It starts at London Season, cycles through 18 entries unconditionally, and wraps last-to-first.
- It has no setup, role occupancy, office creation/removal, Presidency subflow, game-end transition, history, or persistence.
- It contains a `deregulation` flag that the renderer ignores.
- Refresh returns the app to its defaults.

The reusable idea is immediate conditional reading with stable controls. Its phase list, content, and architecture are not authoritative for Shiny Crown.

## Extraction and visual verification

The combined aid has a useful text layer, but most rule grids are embedded raster images. Pages 5–17 and 20 are especially incomplete when read as text alone; page 17 is a full-page flowchart and page 20 is the voting-plan image. Session 1 therefore used four evidence layers:

1. `pdftotext -layout` per page for searchable prose;
2. `pdfplumber` column-aware extraction for reading order;
3. embedded raster extraction with PDF placement bounds;
4. rendered-page visual inspection of every combined-aid page and the pertinent auxiliary pages.

OCR sidecars under `assets/combined-aid/` are deliberately marked as unverified. The normalized visual transcription in `image-transcriptions.md` is the reviewed record.

## Provenance object

Application content should retain source data in development builds or adjacent content modules:

```ts
type SourceDocumentId = "aid-v3.2" | "rules" | "crown-handbook";

type SourceRef = {
  document: SourceDocumentId;
  pages: number[];
  section: string;
  assetIds?: string[];
  mode: "shared" | "solo" | "two-player";
  use: "primary" | "clarification" | "replacement";
  note?: string;
};
```

Examples:

```ts
const chairmanClimate: SourceRef = {
  document: "aid-v3.2",
  pages: [5],
  section: "6. Chairman / 3. Set Climate",
  assetIds: ["aid.p05.Image80"],
  mode: "solo",
  use: "primary",
};

const familyActionCount2p: SourceRef[] = [
  {
    document: "aid-v3.2",
    pages: [2],
    section: "2. Family / 1. Family Action",
    mode: "solo",
    use: "primary",
  },
  {
    document: "crown-handbook",
    pages: [2],
    section: "Family / Family Actions",
    mode: "two-player",
    use: "replacement",
    note: "Crown takes one normal family action in 2P instead of two.",
  },
];
```

Stable semantic IDs must describe the rule, not its current wording or page location. Recommended patterns include `phase.chairman.crown.debt.default`, `favor.shipping.buy-company-ship.more`, and `reference.crisis.region-loss`. This lets a later Portuguese source map replace words without changing behavior.

## Precedence and conflict handling

1. Solo copy and solo rule behavior: aid v3.2.
2. Missing shared/base context: Rules, unless it would reverse an explicit aid v3.2 change.
3. 2P: Crown Handbook and Rules replace solo-only shortcuts and add Button behavior.
4. If the books do not define an edge case, keep exact source guidance visible and leave automation/manual state conservative. Record the gap in `decisions-and-questions.md`.
5. The reference app can inform interaction speed and layout only.

No application text should silently resolve a source conflict. A deliberate ruling must be documented and tested.

