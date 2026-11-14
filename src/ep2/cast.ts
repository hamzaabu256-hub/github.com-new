import type { ToonSpec } from "../engine/draw";
// Goodchaos cast: a tired office worker (the hero) and a developer in a hoodie.
export const C: Record<string, ToonSpec> = {
  worker: { hat: "none", coat: "#6a86b8", vest: "#2e3a56", buttons: "#e8e4dc", hair: "#3a2a22", glasses: true },
  dev: { hat: "none", coat: "#6a4a7a", scarf: "#c8603a", hair: "#c8603a", beard: true, glasses: true, wide: 1.1 },
};
