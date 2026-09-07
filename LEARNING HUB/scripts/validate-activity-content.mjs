import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { extname, join, relative } from "node:path";

const contentDirectory = fileURLToPath(new URL("../public/content", import.meta.url));
const allowedQuestionTypes = new Set(["choice", "number"]);
const allowedActivityKinds = new Set(["practice", "quiz"]);
const errors = [];

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listHtmlFiles(path) : [path];
    }),
  );
  return files.flat().filter((path) => extname(path).toLowerCase() === ".html");
}

function readAttributes(openingTag) {
  const attributes = new Map();
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of openingTag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}

function findOpeningTag(source, attribute) {
  const pattern = new RegExp(`<[^>]*\\b${attribute}(?:\\s|=|>)[^>]*>`, "i");
  return source.match(pattern)?.[0] ?? "";
}

function hasBilingualText(openingTag) {
  const attributes = readAttributes(openingTag);
  return Boolean(attributes.get("data-th")?.trim() && attributes.get("data-en")?.trim());
}

function addError(file, message) {
  errors.push(`${relative(contentDirectory, file)}: ${message}`);
}

function validateQuestion(file, openingTag, body, index, seenIds) {
  const attributes = readAttributes(openingTag);
  const questionId = attributes.get("data-question-id")?.trim();
  const type = attributes.get("data-question-type")?.trim();
  const answer = attributes.get("data-answer")?.trim();
  const label = questionId || `question ${index + 1}`;

  if (!questionId) {
    addError(file, `Question ${index + 1} is missing data-question-id.`);
  } else if (!/^[a-z][a-z0-9-]*$/.test(questionId)) {
    addError(file, `${label} must use a lowercase stable id.`);
  } else if (seenIds.has(questionId)) {
    addError(file, `Duplicate question id: ${questionId}.`);
  }
  seenIds.add(questionId);

  if (!allowedQuestionTypes.has(type)) {
    addError(file, `${label} has unsupported type "${type || "missing"}".`);
  }
  if (!answer) addError(file, `${label} is missing data-answer.`);

  const prompt = findOpeningTag(body, "data-question-prompt");
  if (!prompt || !hasBilingualText(prompt)) {
    addError(file, `${label} needs a prompt with data-th and data-en.`);
  }

  if (type === "choice") {
    const optionTags = [...body.matchAll(/<li\b[^>]*\bdata-choice-id(?:\s|=|>)[^>]*>/gi)].map(
      (match) => match[0],
    );
    const optionIds = new Set();
    if (optionTags.length < 2) addError(file, `${label} needs at least two choices.`);

    optionTags.forEach((optionTag) => {
      const optionAttributes = readAttributes(optionTag);
      const optionId = optionAttributes.get("data-choice-id")?.trim();
      if (!optionId || optionIds.has(optionId)) {
        addError(file, `${label} has an empty or duplicate choice id.`);
      }
      optionIds.add(optionId);
      if (!hasBilingualText(optionTag)) {
        addError(file, `${label} choice ${optionId || "?"} needs data-th and data-en.`);
      }
    });
    if (answer && !optionIds.has(answer)) {
      addError(file, `${label} answer "${answer}" does not match a choice id.`);
    }
  }

  if (type === "number") {
    const tolerance = Number(attributes.get("data-tolerance"));
    if (!Number.isFinite(Number(answer))) addError(file, `${label} needs a numeric answer.`);
    if (!Number.isFinite(tolerance) || tolerance < 0) {
      addError(file, `${label} needs a non-negative data-tolerance.`);
    }
  }
}

async function validateFile(file) {
  const source = await readFile(file, "utf8");
  const rootTags = [
    ...source.matchAll(/<article\b[^>]*\bdata-learning-activity-content(?:\s|=|>)[^>]*>/gi),
  ].map((match) => match[0]);

  if (rootTags.length !== 1) {
    addError(file, "File must contain exactly one data-learning-activity-content root.");
    return;
  }

  if (/<\s*(script|style|link|iframe|object|embed|form|button|input|textarea|select)\b/i.test(source)) {
    addError(file, "Content files cannot contain scripts, styles, forms, buttons, or inputs.");
  }
  if (/\s(?:class|style|on[a-z]+)\s*=/i.test(source)) {
    addError(file, "Content files cannot define classes, inline styles, or event handlers.");
  }
  if (/\b(?:href|src)\s*=\s*["']\s*javascript:/i.test(source)) {
    addError(file, "Content files cannot use javascript: URLs.");
  }

  const rootAttributes = readAttributes(rootTags[0]);
  const activityId = rootAttributes.get("data-activity-id")?.trim();
  const activityKind = rootAttributes.get("data-activity-kind")?.trim();
  if (!activityId || !/^[a-z][a-z0-9-]*$/.test(activityId)) {
    addError(file, "data-activity-id must be a stable lowercase id.");
  }
  if (rootAttributes.get("data-activity-version") !== "1") {
    addError(file, "data-activity-version must be 1.");
  }
  if (!allowedActivityKinds.has(activityKind)) {
    addError(file, `Unsupported data-activity-kind "${activityKind || "missing"}".`);
  }

  const title = findOpeningTag(source, "data-activity-title");
  const summaryTitle = findOpeningTag(source, "data-activity-summary-title");
  if (!title || !hasBilingualText(title)) {
    addError(file, "Activity title needs data-th and data-en.");
  }
  if (!findOpeningTag(source, "data-activity-summary")) {
    addError(file, "Activity summary is missing.");
  }
  if (!summaryTitle || !hasBilingualText(summaryTitle)) {
    addError(file, "Summary title needs data-th and data-en.");
  }
  if (!findOpeningTag(source, "data-activity-questions")) {
    addError(file, "Question section is missing.");
  }

  const questionBlocks = [
    ...source.matchAll(
      /<article\b([^>]*\bdata-question(?:\s|=|>)[^>]*)>([\s\S]*?)<\/article>/gi,
    ),
  ];
  if (questionBlocks.length === 0) addError(file, "At least one question is required.");

  const seenIds = new Set();
  questionBlocks.forEach((match, index) => {
    validateQuestion(file, `<article ${match[1]}>`, match[2], index, seenIds);
  });
}

const files = await listHtmlFiles(contentDirectory);
await Promise.all(files.map(validateFile));

if (errors.length) {
  console.error("Activity Content V1 validation failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Activity Content V1 passed (${files.length} file${files.length === 1 ? "" : "s"}).`);
}
