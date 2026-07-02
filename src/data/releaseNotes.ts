export interface ReleaseNote {
  version: string
  date: string
  title: string
  notes: string[]
}

// Neueste Version zuerst.
export const releases: ReleaseNote[] = [
  {
    version: '0.2.0',
    date: '2026-07-02',
    title: 'Erkundung & Reise',
    notes: [
      'Teilbare Deep-Links: ausgewählter Körper, Fokus, Ansicht und Datum stehen in der URL.',
      'Suchfeld zum schnellen Anspringen von Körpern, Pfeiltasten links/rechts schalten durch.',
      'Info-Panel zeigt eine echte, beleuchtete Frontansicht des Körpers statt einer Farbscheibe.',
      'Größenvergleich zur Erde für jeden Planeten.',
      'Reise-Modus: automatische Kamera-Tour durch Sonne und Planeten.',
      'Dichterer, hellerer Sternenhintergrund im Dunkelmodus.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-07-01',
    title: 'Erste fertige Version',
    notes: [
      'Dunkler Weltraum-Modus als Standard, heller Modus bleibt umschaltbar.',
      'Realistischere Planeten mit Texturen, Schattenseiten und besserem Licht.',
      'Erde mit Tag/Nacht-Seite, sichtbaren Wolken und dezenter Atmosphäre.',
      'Pause, Fokus-Auswahl und näherer Zoom für bequemere Erkundung.',
      'Zeitsteuerung mit Datum, Heute-Button und feineren Simulationsgeschwindigkeiten.',
      'Astronomisch plausiblere Planetenpositionen auf Basis von J2000-Orbitdaten.',
      'Umlaufbahnen als flache Ekliptik-Scheibe mit realistischen kleinen Neigungen.',
      'Mond der Erde mit eigener Textur, Umlaufbahn, Rotation, Schattenseite und Fokus-Option.',
      'Ruhigere Planetenbewegung bei schneller Zeitsimulation.',
    ],
  },
]
