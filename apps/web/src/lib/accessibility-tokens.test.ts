import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const GLOBAL_CSS = new URL("../styles/global.css", import.meta.url);
const LIGHT_BACKGROUNDS = ["#ffffff", "#f5f5f3"];
const MIN_NORMAL_TEXT_CONTRAST = 4.5;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function relativeLuminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function lightToken(name: string) {
  const css = readFileSync(GLOBAL_CSS, "utf8");
  const rootBlock = css.match(/:root\s*{([\s\S]*?)\n}/)?.[1];
  assert.ok(rootBlock, "expected :root design tokens to exist");

  const match = rootBlock.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6});`));
  assert.ok(match, `expected --${name} to be a hex token`);
  return match[1]!;
}

test("subtle light-mode ink tokens remain readable on public surfaces", () => {
  for (const token of ["ink-300", "ink-400"]) {
    const foreground = lightToken(token);

    for (const background of LIGHT_BACKGROUNDS) {
      assert.ok(
        contrastRatio(foreground, background) >= MIN_NORMAL_TEXT_CONTRAST,
        `${token} (${foreground}) must pass contrast on ${background}`,
      );
    }
  }
});
