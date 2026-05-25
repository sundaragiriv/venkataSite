---
id: "d3-t5-2-test-driven"
title: "Test-Driven Workflows with Claude Code"
domain: "d3"
taskRef: "T3.5"
order: 14
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Building to a blueprint vs hoping it fits. Tests are executable blueprints — unambiguous specifications Claude can verify against automatically. Write tests first, implement second."
examTrap: "Writing tests and implementation simultaneously and calling it test-driven. True TDD has clear separation: tests define correctness independently, implementation is judged against them."
keyPoints:
  - "Tests first, implementation second — Claude has clear acceptance criteria before writing any production code."
  - "Existing failing tests are the highest quality spec available — unambiguous and automatically verifiable."
  - "Use bash() in the agentic loop to run tests between changes — automated verification."
  - "Never modify tests to make them pass — fix the implementation."
  - "No error path tests = Claude doesn't know what NOT to do — include both success and failure cases."
antiPatterns:
  - "Writing tests after implementation — they describe what code does, not what it should do"
  - "Not running tests between iterations — accumulating unverified changes"
  - "Modifying tests to pass — the spec becomes what Claude wrote, not your intention"
  - "Happy-path-only tests — Claude needs to know error behavior too"
tbChallenge: "You need to implement calculateLoyaltyDiscount(customer_tier, order_amount). No tests exist. Walk me through the complete TDD workflow with Claude Code from 'no tests' to 'all green.'"
---

## TDD Workflow: Step by Step

```markdown
# Step 1: Write tests FIRST (no implementation yet)

Write comprehensive tests for calculateLoyaltyDiscount().
Function: calculateLoyaltyDiscount(tier: str, amount_cents: int) -> int
Returns: discount amount in cents

Rules:
- standard tier: 0% discount
- premium tier: 5% on orders over 5000 cents ($50), else 0%
- enterprise tier: 10% on all orders
- Invalid tier: raises ValueError
- Negative amount: raises ValueError
- Minimum discount: 0 (never negative)

Write tests covering all tiers, boundary conditions, and error cases.
DO NOT write the implementation. Tests only.
Run: bash("pytest tests/test_loyalty.py -v")
Expected: all FAIL (no implementation exists)
```

```python
# Tests Claude generates:
def test_standard_tier_no_discount():
    assert calculate_loyalty_discount("standard", 10000) == 0

def test_premium_below_threshold():
    assert calculate_loyalty_discount("premium", 4999) == 0

def test_premium_above_threshold():
    assert calculate_loyalty_discount("premium", 5000) == 250  # 5% of 5000

def test_enterprise_all_orders():
    assert calculate_loyalty_discount("enterprise", 1000) == 100  # 10%

def test_invalid_tier():
    with pytest.raises(ValueError, match="Invalid tier"):
        calculate_loyalty_discount("gold", 1000)

def test_negative_amount():
    with pytest.raises(ValueError):
        calculate_loyalty_discount("premium", -100)
```

```markdown
# Step 2: Verify tests fail (no implementation)
bash("pytest tests/test_loyalty.py -v")
# Expected: 6 FAILED — implementation doesn't exist

# Step 3: Implement to pass all tests
Write calculateLoyaltyDiscount() in src/loyalty.py
After writing: bash("pytest tests/test_loyalty.py -v")
# Expected: 6 PASSED

# Step 4: Full suite check
bash("pytest -v")
# Expected: all existing tests still pass (no regressions)
```

## Using Existing Failing Tests as Spec

```markdown
8 tests are failing in tests/test_payment_service.py after the refactor.

Read each test carefully. The tests define what PaymentService must do.
DO NOT modify any test file.
Fix PaymentService in src/services/payment_service.py to make all 8 pass.

After each significant change:
bash("pytest tests/test_payment_service.py -v")
```

## Key Takeaways

1. **Tests first** — unambiguous acceptance criteria before production code
2. **bash() to verify** after each change — don't accumulate uncertainty
3. **Never modify tests** — fix the implementation
4. **Include error path tests** — Claude needs to know failure behavior
5. **Full suite check** after getting target tests green — verify no regressions
