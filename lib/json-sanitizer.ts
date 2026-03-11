/**
 * json-sanitizer.ts
 *
 * A robust JSON sanitization utility to correct common errors produced by AI
 * language models before attempting JSON.parse().
 *
 * Strategy: Apply a series of targeted regex replacements to the raw string,
 * then fall back to a bracket-balancing approach if the first attempt still
 * fails. This makes the rendering resilient to model hallucinations/typos.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SanitizeResult {
  json: string;
  parsed: unknown;
  wasRepaired: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip markdown code fences (```json ... ``` or ``` ... ```) that the model
 * sometimes adds around its JSON response.
 */
function stripCodeFences(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
}

/**
 * Apply a series of lightweight, targeted fixes to known AI formatting errors.
 * Each rule is documented so future failures can be traced back here.
 */
function applyTargetedFixes(s: string): string {
  return (
    s
      // RULE 1: Closing parenthesis used instead of bracket after a string in
      // an array context.  e.g. "database": ["neon") → "database": ["neon"]
      // Pattern: closing paren directly after a quoted string or closing bracket.
      .replace(/("[^"]*"|])\s*\)/g, "$1]")

      // RULE 2: Trailing comma before closing brace / bracket (JSON doesn't allow
      // trailing commas). e.g. { "a": 1, }  → { "a": 1 }
      .replace(/,\s*([}\]])/g, "$1")

      // RULE 3: Single quotes instead of double quotes on keys or values.
      // Extremely naive – only safe for simple, unescaped values.
      .replace(/'([^']*)'(\s*:)/g, '"$1"$2') // keys
      .replace(/:\s*'([^']*)'/g, ': "$1"') // values

      // RULE 4: Unquoted property name. e.g. { nombre: "x" } → { "nombre": "x" }
      // Only touches keys that look safe (word chars, hyphens, underscores).
      .replace(/([{,]\s*)([\w-]+)(\s*:)/g, '$1"$2"$3')

      // RULE 5: Python-style True/False/None → JSON true/false/null
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\bNone\b/g, "null")

      // RULE 6: Ellipsis or placeholder values like "..." that break string
      // parsing – keep them but make sure they don't break the structure.
      // (No change needed, they are valid JSON strings, left as-is.)
  );
}

/**
 * Balance unmatched brackets / braces / quotes by appending the missing
 * closing tokens.  This is a last-ditch effort and may produce semantically
 * wrong JSON, but at least parse() won't throw.
 */
function balanceBrackets(s: string): string {
  const stack: string[] = [];
  let inString = false;
  let escape = false;

  for (const ch of s) {
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") {
      if (stack[stack.length - 1] === ch) stack.pop();
    }
  }

  // Close any open string
  if (inString) s += '"';

  // Close remaining open brackets/braces (reversed order)
  return s + stack.reverse().join("");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Attempt to parse a raw AI response string as JSON.
 * Returns null if parsing is impossible even after all repair attempts.
 */
export function sanitizeAndParseJson(raw: string): SanitizeResult | null {
  if (!raw || !raw.trim()) return null;

  const stripped = stripCodeFences(raw);

  // Only attempt repair for strings that look like JSON objects/arrays.
  if (!stripped.startsWith("{") && !stripped.startsWith("[")) return null;

  // ---- Attempt 1: vanilla parse (fastest, no overhead) --------------------
  try {
    const parsed = JSON.parse(stripped);
    return { json: stripped, parsed, wasRepaired: false };
  } catch {
    // Fall through to repair pipeline.
  }

  // ---- Attempt 2: targeted fixes ------------------------------------------
  const fixed = applyTargetedFixes(stripped);
  try {
    const parsed = JSON.parse(fixed);
    return { json: fixed, parsed, wasRepaired: true };
  } catch {
    // Fall through.
  }

  // ---- Attempt 3: bracket balancing on top of targeted fixes ---------------
  const balanced = balanceBrackets(fixed);
  try {
    const parsed = JSON.parse(balanced);
    return { json: balanced, parsed, wasRepaired: true };
  } catch {
    // Fall through.
  }

  // ---- Attempt 4: bracket balancing on the original stripped string ---------
  const balancedOriginal = balanceBrackets(stripped);
  try {
    const parsed = JSON.parse(balancedOriginal);
    return { json: balancedOriginal, parsed, wasRepaired: true };
  } catch {
    // All attempts exhausted.
    return null;
  }
}
