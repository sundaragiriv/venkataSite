---
id: "d4-t5-3-batch-processing"
title: "Batch Processing — Message Batches API for High-Volume Work"
domain: "d4"
taskRef: "T4.5"
order: 15
xp: 30
tag: "⚡ Exam Tested"
duration: "7 min"
analogy: "Overnight cloud photo processing vs same-day in-store printing. Overnight is 50% cheaper, handles thousands at once — but results come the next morning. The Batch API is the overnight option: cheaper and scalable, but never for anything time-sensitive."
examTrap: "Using Batch API for anything with a latency requirement. It has NO guaranteed SLA — up to 24 hours. The exam specifically tests that you know not to use it for CI/CD pipeline checks, user-blocking features, or real-time workflows."
keyPoints:
  - "Batch API: 50% cost reduction. Processing time up to 24 hours. No latency SLA."
  - "Use for: nightly jobs, non-urgent large volumes, cost-sensitive backfills."
  - "Never use for: CI/CD checks, user-blocking features, any latency requirement."
  - "custom_id field: YOUR correlation key — essential for partial failure recovery."
  - "Partial failure: resubmit only failed requests by custom_id — not the entire batch."
antiPatterns:
  - "Batch API for pre-merge CI/CD — may take 24 hours"
  - "No custom_id — can't identify which requests failed"
  - "Resubmitting entire batch on partial failure — wastes cost savings"
  - "Assuming synchronous completion — must poll for status"
tbChallenge: "50,000 invoices need overnight processing. Design the Batch API strategy: request structure with custom_ids, polling logic, and what you do when 2,000 requests fail."
---

## The Batch API Decision Rule

```
Has a latency requirement?        → Real-time API
User is waiting?                  → Real-time API
CI/CD pipeline step?              → Real-time API (batch can take 24h)

Non-urgent overnight processing?  → Batch API
Volume > 1,000 + cost sensitive?  → Consider Batch API
Backfill operation?               → Batch API
```

## Complete Batch Workflow

```python
import anthropic, time

client = anthropic.Anthropic()

# 1. Build with custom_ids for correlation
requests = [
    {
        "custom_id": f"inv-{inv_id}",         # YOUR key — persists in response
        "params": {
            "model":      "claude-sonnet-4-6",
            "max_tokens": 2048,
            "tools":       [invoice_extraction_tool],
            "tool_choice": {"type": "tool", "name": "extract_invoice"},
            "messages": [{"role": "user", "content": f"Extract:\n{inv_text}"}]
        }
    }
    for inv_id, inv_text in invoices.items()
]

# 2. Submit
batch = client.beta.messages.batches.create(requests=requests)
batch_id = batch.id

# 3. Poll (batch is asynchronous — must check status)
while True:
    status = client.beta.messages.batches.retrieve(batch_id)
    if status.processing_status == "ended":
        break
    time.sleep(60)  # check every minute

# 4. Separate successes from failures
succeeded, failed = [], []
for result in client.beta.messages.batches.results(batch_id):
    inv_id = result.custom_id.replace("inv-", "")
    if result.result.type == "succeeded":
        succeeded.append({"id": inv_id, "data": parse_tool_result(result.result.message)})
    else:
        failed.append({"id": inv_id, "custom_id": result.custom_id,
                        "error": result.result.error.type})

print(f"Succeeded: {len(succeeded)}, Failed: {len(failed)}")

# 5. Resubmit ONLY failed — not the whole batch
if failed:
    failed_ids = {f["custom_id"] for f in failed}
    retry_requests = [r for r in requests if r["custom_id"] in failed_ids]
    retry_batch = client.beta.messages.batches.create(requests=retry_requests)
    print(f"Resubmitting {len(retry_requests)} failed as batch {retry_batch.id}")
```

## Key Takeaways

1. **50% cheaper, up to 24h** — non-urgent work only
2. **Never for latency-sensitive** — CI/CD, user-blocking, real-time
3. **custom_id is essential** — enables partial failure recovery
4. **Resubmit only failures** — don't resubmit successful requests
5. **Poll for completion** — asynchronous, not synchronous
