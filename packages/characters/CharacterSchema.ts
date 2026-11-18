export type HeadView = "front" | "threeQuarter" | "profile";

export type EmotionState =
  | "neutral"
  | "warm"
  | "excited"
  | "focused"
  | "worried"
  | "angry"
  | "smirk"
  | "starving";

export type ActorProp =
  | "none"
  | "wheat"
  | "seedJar"
  | "riceBag"
  | "notebook"
  | "pen"
  | "point"
  | "candle";

export type HairStyle = "wavy_side_part" | "severe_forelock" | "classic_scholar";

export interface HistoricalCharacterSpec {
  id: string;
  name: string;
  era: string;
  skin: string;
  skinMid: string;
  coat: string;
  coatMid: string;
  vest: string;
  collar: string;
  tie: string;
  hair: string;
  hairHi: string;
  iris: string;
  hairStyle: HairStyle;
  hasMoustache?: boolean;
  hasGlasses?: boolean;
  hasScarf?: boolean;
  isGaunt?: boolean;
  lapelPinColor?: string;
}

export const CHARACTER_PRESETS: Record<string, HistoricalCharacterSpec> = {
  nikolai_vavilov: {
    id: "nikolai_vavilov",
    name: "Nikolai I. Vavilov",
    era: "1887–1943 · Botanis & Genetikawan Rusia",
    skin: "#e5be9e",
    skinMid: "#bc9170",
    coat: "#3d312a",
    coatMid: "#241d18",
    vest: "#5c4738",
    collar: "#f4efe6",
    tie: "#8c2f27",
    hair: "#1b1613",
    hairHi: "#473930",
    iris: "#3b2416",
    hairStyle: "wavy_side_part",
    hasMoustache: true,
    hasGlasses: false,
    hasScarf: false,
    isGaunt: false,
  },
  dmitri_ivanov: {
    id: "dmitri_ivanov",
    name: "Dmitri S. Ivanov",
    era: "Wafat Jan 1942 · Spesialis Padi VIR",
    skin: "#d2beae",
    skinMid: "#9e8876",
    coat: "#28363d",
    coatMid: "#162025",
    vest: "#3d4f58",
    collar: "#cad2c5",
    tie: "#52796f",
    hair: "#2b2623",
    hairHi: "#5c534d",
    iris: "#382c22",
    hairStyle: "classic_scholar",
    hasMoustache: false,
    hasGlasses: true,
    hasScarf: true,
    isGaunt: true,
  },
  trofim_lysenko: {
    id: "trofim_lysenko",
    name: "Trofim D. Lysenko",
    era: "1898–1976 · Presiden VASKhNIL",
    skin: "#dec0a6",
    skinMid: "#b08d71",
    coat: "#1f2933",
    coatMid: "#10161c",
    vest: "#2f3e46",
    collar: "#e0e1dd",
    tie: "#9b2226",
    hair: "#161412",
    hairHi: "#3d3834",
    iris: "#2b4c65",
    hairStyle: "severe_forelock",
    hasMoustache: false,
    hasGlasses: false,
    hasScarf: false,
    isGaunt: true,
    lapelPinColor: "#c1121f",
  },
  michael_faraday: {
    id: "michael_faraday",
    name: "Michael Faraday",
    era: "1791–1867 · Royal Institution London",
    skin: "#e8c4a6",
    skinMid: "#c29979",
    coat: "#20242c",
    coatMid: "#12151a",
    vest: "#3f4654",
    collar: "#f7f3eb",
    tie: "#2b2d42",
    hair: "#362b24",
    hairHi: "#6b574b",
    iris: "#2e4057",
    hairStyle: "wavy_side_part",
    hasMoustache: false,
    hasGlasses: false,
    hasScarf: false,
    isGaunt: false,
  },
};
