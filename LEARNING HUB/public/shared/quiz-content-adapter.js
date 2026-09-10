import { normalizeQuestion } from "./quiz-question-model.js";

function richText(node) {
  if (!node) return null;
  return Object.fromEntries(["th", "en"].map(lang => {
    const localized = node.querySelector(`[data-quiz-language="${lang}"]`);
    return [lang, localized?.innerHTML || node.dataset[lang] || node.innerHTML || ""];
  }));
}

export function readQuizContent(root) {
  const errors = [];
  if (!root) return { errors: ["Missing data-learning-activity-content."], questions: [] };
  if (root.dataset.activityKind !== "quiz") errors.push("Content is not a quiz.");
  if (!/^[a-z][a-z0-9-]*$/.test(root.dataset.activityId || "")) errors.push("Missing stable quiz id.");
  const seen = new Set();
  const questions = [...root.querySelectorAll("[data-question]")].map((element, index) => {
    const prompt = element.querySelector("[data-question-prompt]");
    const context = element.querySelector("[data-question-context]");
    const options = [...element.querySelectorAll("[data-choice-id]")];
    const hints = [...element.querySelectorAll("[data-question-hint]")];
    const solution = element.querySelector("[data-question-solution]");
    const list = name => element.dataset[name]?.trim().split(/\s+/).filter(Boolean) || [];
    const normalized = normalizeQuestion({
      id: element.dataset.questionId, type: element.dataset.questionType,
      answer: element.dataset.answer, tolerance: element.dataset.tolerance,
      prompt: richText(prompt), context: richText(context),
      choices: options.map(option => ({ id: option.dataset.choiceId, text: richText(option) })),
      hints: hints.map(richText), solution: richText(solution),
      unit: { th: element.dataset.unitTh, en: element.dataset.unitEn },
      topicIds: list("topicIds"), examIds: list("examIds"),
    });
    if (seen.has(element.dataset.questionId)) errors.push(`Duplicate question ID: ${element.dataset.questionId}.`);
    seen.add(element.dataset.questionId);
    errors.push(...normalized.errors.map(error => `Question ${index + 1}: ${error}`));
    return { ...normalized.question, index, element, prompt, context, options, hints, solution };
  });
  if (!questions.length) errors.push("No questions found.");
  return { errors, questions };
}
