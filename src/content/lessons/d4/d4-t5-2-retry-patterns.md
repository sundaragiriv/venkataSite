---
id: "d4-t5-2-retry-patterns"
title: "Retry Patterns — Three-Component Retry for Effective Error Recovery"
domain: "d4"
taskRef: "T4.5"
order: 14
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A proofreader marking a draft. Not 'this is wrong' — but specific marks on each error with the correction. The author addresses each mark precisely. Claude's retry needs the same specificity: field name, what it got, what's expected."
examTrap: "Retrying with the original prompt unchanged — produces identical wrong output. The retry must include all three: original document, previous failed output, AND specific error descriptions."
keyPoints:
  - "Three required retry components: original document + failed output + specific errors."
  - "Without the failed output: Claude doesn't know what to change."
  - "Without specific errors: Claude doesn't know what's wrong."
  - "Error format: field name + what was extracted + what's expected."
  - "Never retry when source document lacks the information — produces fabrication instead."
antiPatterns:
  - "Retrying with only original prompt — same wrong output"
  - "Vague errors: 'date invalid' vs 'invoice_date must be YYYY-MM-DD, got Jan 15 2024'"
  - "Retrying missing-data errors — fabrication results"
  - "No retry cap — cost explodes on consistently difficult documents"
tbChallenge: "Extractor returned invoice_date='January 15, 2024' and total_amount='$4,999.00'. Schema requires ISO date and decimal number. Write the complete three-component retry prompt."
---

## The Three-Component Retry

```python
def build_retry_prompt(document: str, failed_output: dict, errors: list) -> str:
    """All three components are required — missing any one degrades retry effectiveness."""
    error_text = "\n".join([
        f"• {e['field']}: {e['error']}"
        + (f"\n  Got: {e['got']}" if 'got' in e else "")
        + (f"\n  Expected: {e['expected']}" if 'expected' in e else "")
        for e in errors
    ])

    return f"""Your previous extraction failed validation. Fix the specific errors listed.

ORIGINAL DOCUMENT:
{document}

YOUR PREVIOUS (INCORRECT) EXTRACTION:
{json.dumps(failed_output, indent=2)}

ERRORS TO FIX:
{error_text}

Fix only these errors. Do not change fields that were correct.
If a value is not in the document, return null — do not invent values."""
```

## Specific Error Messages

```python
# ❌ Vague — Claude can't fix this
{"field": "invoice_date", "error": "Invalid format"}

# ✅ Specific — Claude knows exactly what to change
{
    "field":    "invoice_date",
    "error":    "Must be ISO format YYYY-MM-DD",
    "got":      "January 15, 2024",
    "expected": "2024-01-15"
},
{
    "field":    "total_amount",
    "error":    "Must be a decimal number in dollars, not a string with currency symbol",
    "got":      "$4,999.00",
    "expected": 4999.00
}
```

## When Not to Retry

```python
# Source-missing errors produce fabrication on retry — never retry these
NOT_RETRYABLE = [
    "not found in source document",
    "not in the document",
    "document does not contain",
    "absent from"
]

def should_retry(error: dict) -> bool:
    return not any(p in error.get("error", "").lower() for p in NOT_RETRYABLE)
```

## Key Takeaways

1. **All three components**: document + failed output + specific errors
2. **Field + got + expected** in every error message
3. **Never retry missing-data errors** — fabrication
4. **Cap at 2-3 retries** — escalate to human review after
5. **"Fix only listed errors"** — targeted correction, not re-do
