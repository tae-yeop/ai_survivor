#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { htmlToMdx } from "../src/lib/admin/html-to-mdx.ts";
import { createEmptyAdminPostDraft, serializeAdminPostDraft } from "../src/lib/admin/mdx.ts";
import { assertValidPostSlug, normalizePostSlug } from "../src/lib/admin/slug.ts";

function parseArgs(argv) {
  const args = {};
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }
    const key = token.slice(2);
    if (key === "stdout" || key === "help") {
      args[key] = true;
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`--${key} requires a value`);
    }
    args[key] = value;
    index += 1;
  }
  if (positional[0] && !args.html) args.html = positional[0];
  return args;
}

function usage() {
  return `
Usage:
  npm run post:html-to-mdx -- --html draft.html --title "글 제목" --description "요약" --tags "ai,blog" --tools "Next.js" [--slug my-post]

Options:
  --html <file>          HTML input file. A full HTML document or body fragment both work.
  --title <text>         Post title. Required.
  --description <text>   Post description. Required.
  --slug <slug>          Optional. Defaults to normalized title.
  --tags <a,b>           Comma-separated tags. Required.
  --tools <a,b>          Comma-separated tools. Required.
  --category <slug>      Defaults to vibe-coding-lab.
  --difficulty <value>   Defaults to beginner.
  --status <value>       Defaults to draft.
  --out <dir>            Defaults to content/posts.
  --stdout               Print MDX instead of writing content/posts/<slug>/index.mdx.
`;
}

function requireText(args, key) {
  const value = args[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} is required`);
  }
  return value.trim();
}

function splitCsv(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage().trim());
    return;
  }

  const htmlFile = requireText(args, "html");
  const title = requireText(args, "title");
  const description = requireText(args, "description");
  const tags = splitCsv(requireText(args, "tags"));
  const tools = splitCsv(requireText(args, "tools"));
  const slug = assertValidPostSlug(args.slug ?? normalizePostSlug(title));
  const html = readFileSync(htmlFile, "utf8");
  const body = htmlToMdx(html);
  const today = new Date().toISOString().slice(0, 10);

  const source = serializeAdminPostDraft({
    ...createEmptyAdminPostDraft(),
    title,
    description,
    slug,
    publishedAt: args.publishedAt ?? today,
    updatedAt: args.updatedAt ?? today,
    status: args.status ?? "draft",
    category: args.category ?? "vibe-coding-lab",
    difficulty: args.difficulty ?? "beginner",
    tags,
    tools,
    coverImage: args.coverImage ?? null,
    coverAlt: args.coverAlt ?? null,
    body,
  });

  if (args.stdout) {
    process.stdout.write(source);
    return;
  }

  const root = args.out ?? path.join("content", "posts");
  const postDir = path.join(root, slug);
  mkdirSync(postDir, { recursive: true });
  const outFile = path.join(postDir, "index.mdx");
  writeFileSync(outFile, source, "utf8");
  console.log(`Wrote ${outFile}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error(usage().trim());
  process.exitCode = 1;
}
