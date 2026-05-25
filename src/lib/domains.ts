export type DomainId = 'd0' | 'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6';

export interface Domain {
  id:          DomainId;
  code:        string;
  title:       string;
  subtitle:    string;
  color:       string;
  bgColor:     string;
  icon:        string;
  tag:         string;
  examWeight:  string | null;
  taskCount:   number;
  lessonCount: number;
  description: string;
  taskStatements: TaskStatement[];
}

export interface TaskStatement {
  ref:         string;    // "T1.1"
  title:       string;
  description: string;
  lessonIds:   string[];  // which lesson files cover this
}

export const DOMAINS: Domain[] = [
  {
    id: 'd0',
    code: 'D0',
    title: 'AI & Claude Foundations',
    subtitle: 'Zero to understanding — before the exam begins',
    color: '#06b6d4',
    bgColor: '#06b6d412',
    icon: '🌱',
    tag: 'START HERE',
    examWeight: null,
    taskCount: 0,
    lessonCount: 12,
    description: 'Zero assumed knowledge. Build genuine intuition about AI, LLMs, Claude, and the API before touching any exam content. Essential for teaching this content to others.',
    taskStatements: [],
  },
  {
    id: 'd1',
    code: 'D1',
    title: 'Agentic Architecture & Orchestration',
    subtitle: 'The foundation of everything — 27% of your score',
    color: '#6366f1',
    bgColor: '#6366f112',
    icon: '🤖',
    tag: '27% OF EXAM',
    examWeight: '27%',
    taskCount: 7,
    lessonCount: 21,
    description: 'The heaviest domain. Covers how Claude operates inside autonomous agent loops: the observe-think-act-respond cycle, multi-agent orchestration, hooks, state management, and the reliability patterns that make agentic systems safe at scale.',
    taskStatements: [
      {
        ref: 'T1.1',
        title: 'Agent Loop Design',
        description: 'stop_reason-based control flow, tool_use continuation vs end_turn termination, adding tool results to conversation history, anti-patterns in loop termination.',
        lessonIds: ['d1-t1-1-loop-basics', 'd1-t1-2-loop-control', 'd1-t1-3-loop-antipatterns'],
      },
      {
        ref: 'T1.2',
        title: 'Multi-Agent Orchestration',
        description: 'Hub-and-spoke architecture, coordinator-subagent communication, context isolation between agents, parallel vs sequential execution.',
        lessonIds: ['d1-t2-1-hub-spoke', 'd1-t2-2-context-isolation', 'd1-t2-3-parallel-sequential'],
      },
      {
        ref: 'T1.3',
        title: 'Sub-Agent Spawning',
        description: 'Task tool, AgentDefinition, fork_session, when to use parallel vs sequential spawning, handling spawn failures.',
        lessonIds: ['d1-t3-1-task-tool', 'd1-t3-2-fork-session', 'd1-t3-3-spawning-patterns'],
      },
      {
        ref: 'T1.4',
        title: 'Multi-Step Workflows & Enforcement',
        description: 'Programmatic enforcement (hooks, precondition gates) vs prompt-based guidance. The single most tested concept. When deterministic compliance is required, prompts alone are insufficient.',
        lessonIds: ['d1-t4-1-enforcement-vs-prompts', 'd1-t4-2-hooks-deep', 'd1-t4-3-workflow-patterns'],
      },
      {
        ref: 'T1.5',
        title: 'Agent SDK Hooks',
        description: 'PreToolUse and PostToolUse hooks, tool call interception, policy violation blocking, hook execution order and timing.',
        lessonIds: ['d1-t5-1-pretooluse', 'd1-t5-2-posttooluse', 'd1-t5-3-hook-patterns'],
      },
      {
        ref: 'T1.6',
        title: 'State Management',
        description: 'Conversation context persistence, session isolation, stateful vs stateless design tradeoffs, crash recovery and state export.',
        lessonIds: ['d1-t6-1-state-basics', 'd1-t6-2-session-management', 'd1-t6-3-crash-recovery'],
      },
      {
        ref: 'T1.7',
        title: 'Task Decomposition',
        description: 'Breaking complex requests into manageable subtasks, fixed pipeline vs dynamic decomposition, granularity decisions, the coordinator trap.',
        lessonIds: ['d1-t7-1-decomp-patterns', 'd1-t7-2-coordinator-trap', 'd1-t7-3-minimal-footprint'],
      },
    ],
  },
  {
    id: 'd2',
    code: 'D2',
    title: 'Tool Design & MCP Integration',
    subtitle: 'Tools are how agents act — design them right',
    color: '#8b5cf6',
    bgColor: '#8b5cf612',
    icon: '🔧',
    tag: '18% OF EXAM',
    examWeight: '18%',
    taskCount: 5,
    lessonCount: 15,
    description: 'Tool schema design, MCP server/client architecture, scoped access control, error handling, and tool result formatting. If tool design is inadequate, agentic loops break down.',
    taskStatements: [
      {
        ref: 'T2.1',
        title: 'Tool Schema Design',
        description: 'Writing effective tool descriptions, input schema design, ambiguous tool differentiation, when to split vs consolidate tools.',
        lessonIds: ['d2-t1-1-descriptions', 'd2-t1-2-schema-design', 'd2-t1-3-tool-boundaries'],
      },
      {
        ref: 'T2.2',
        title: 'MCP Architecture',
        description: 'MCP three primitives (tools, resources, prompts), server implementation, client integration, transport layer (stdio, SSE), Python vs TypeScript SDKs.',
        lessonIds: ['d2-t2-1-mcp-primitives', 'd2-t2-2-server-client', 'd2-t2-3-transport-config'],
      },
      {
        ref: 'T2.3',
        title: 'Scoped Access Control',
        description: 'tool_choice options (auto/any/forced), permission boundaries in multi-agent systems, tool distribution per agent role, Grep vs Glob.',
        lessonIds: ['d2-t3-1-tool-choice', 'd2-t3-2-scoped-access', 'd2-t3-3-grep-glob'],
      },
      {
        ref: 'T2.4',
        title: 'Error Handling',
        description: 'Four MCP error categories (transient/validation/business/permission), isRetryable flag, structured error responses, distinguishing access failure from valid empty results.',
        lessonIds: ['d2-t4-1-error-categories', 'd2-t4-2-error-propagation', 'd2-t4-3-recovery-patterns'],
      },
      {
        ref: 'T2.5',
        title: 'Tool Result Formatting',
        description: 'Optimal response structures for downstream processing, PostToolUse normalization, partial results handling, result trimming for context efficiency.',
        lessonIds: ['d2-t5-1-result-formatting', 'd2-t5-2-normalization', 'd2-t5-3-context-efficiency'],
      },
    ],
  },
  {
    id: 'd3',
    code: 'D3',
    title: 'Claude Code Configuration & Workflows',
    subtitle: 'Configure Claude Code for teams and CI/CD',
    color: '#10b981',
    bgColor: '#10b98112',
    icon: '⚙️',
    tag: '20% OF EXAM',
    examWeight: '20%',
    taskCount: 6,
    lessonCount: 18,
    description: 'CLAUDE.md hierarchy design, slash commands and skills, path-specific rules, planning mode, iterative refinement, and CI/CD integration. CLAUDE.md is essentially a form of system prompting.',
    taskStatements: [
      {
        ref: 'T3.1',
        title: 'CLAUDE.md Hierarchy Design',
        description: 'User-level vs project-level vs directory-level, version control implications, @import syntax, .claude/rules/ directory, /memory command.',
        lessonIds: ['d3-t1-1-hierarchy', 'd3-t1-2-version-control', 'd3-t1-3-rules-system'],
      },
      {
        ref: 'T3.2',
        title: 'Slash Commands & Skills',
        description: 'Project-scoped vs user-scoped commands, SKILL.md frontmatter, context:fork, allowed-tools, argument-hint, skills vs CLAUDE.md.',
        lessonIds: ['d3-t2-1-slash-commands', 'd3-t2-2-skills', 'd3-t2-3-command-patterns'],
      },
      {
        ref: 'T3.3',
        title: 'Path-Specific Rules',
        description: 'YAML frontmatter glob patterns, conditional convention loading, when glob patterns beat directory CLAUDE.md, cross-directory conventions.',
        lessonIds: ['d3-t3-1-path-rules', 'd3-t3-2-glob-patterns', 'd3-t3-3-convention-design'],
      },
      {
        ref: 'T3.4',
        title: 'Planning Mode & Execution',
        description: 'Plan mode triggers (45+ files, multiple valid approaches, architectural decisions), Explore subagent, /compact, direct execution criteria.',
        lessonIds: ['d3-t4-1-plan-mode', 'd3-t4-2-explore-subagent', 'd3-t4-3-execution-patterns'],
      },
      {
        ref: 'T3.5',
        title: 'Iterative Refinement',
        description: 'Concrete input/output examples, test-driven iteration, interview pattern for requirements, sequential vs parallel issue resolution.',
        lessonIds: ['d3-t5-1-refinement-basics', 'd3-t5-2-test-driven', 'd3-t5-3-interview-pattern'],
      },
      {
        ref: 'T3.6',
        title: 'CI/CD Integration',
        description: '-p/--print flag for headless execution, --output-format json, independent review instances, prior findings in context, existing test files.',
        lessonIds: ['d3-t6-1-cicd-basics', 'd3-t6-2-headless-mode', 'd3-t6-3-review-pipelines'],
      },
    ],
  },
  {
    id: 'd4',
    code: 'D4',
    title: 'Prompt Engineering & Structured Output',
    subtitle: 'Precision prompting for production systems',
    color: '#f59e0b',
    bgColor: '#f59e0b12',
    icon: '✍️',
    tag: '20% OF EXAM',
    examWeight: '20%',
    taskCount: 6,
    lessonCount: 18,
    description: 'Explicit criteria design, few-shot examples, JSON Schema-based structured output, prompt chaining, output validation, and prompt versioning. Structured output directly impacts context management efficiency.',
    taskStatements: [
      {
        ref: 'T4.1',
        title: 'Explicit Criteria Design',
        description: 'Specific judgment criteria vs vague instructions, false positive trust erosion, severity calibration with concrete code examples.',
        lessonIds: ['d4-t1-1-explicit-criteria', 'd4-t1-2-false-positives', 'd4-t1-3-severity-design'],
      },
      {
        ref: 'T4.2',
        title: 'Few-Shot Example Design',
        description: 'Targeting hard/ambiguous cases, rejection examples, varied document structures, 2-4 example sweet spot, generalization vs memorization.',
        lessonIds: ['d4-t2-1-fewshot-basics', 'd4-t2-2-example-targeting', 'd4-t2-3-format-examples'],
      },
      {
        ref: 'T4.3',
        title: 'JSON Schema & tool_use Output',
        description: 'tool_choice auto/any/forced, nullable fields, enum+other pattern, schema eliminates syntax errors but not semantic errors, forced selection for sequential workflows.',
        lessonIds: ['d4-t3-1-json-schemas', 'd4-t3-2-tool-choice-output', 'd4-t3-3-schema-patterns'],
      },
      {
        ref: 'T4.4',
        title: 'Prompt Chaining',
        description: 'Multi-step reasoning workflows, fixed pipeline vs dynamic, passing context between chains, when chaining beats single-prompt.',
        lessonIds: ['d4-t4-1-chaining-basics', 'd4-t4-2-chain-patterns', 'd4-t4-3-chain-reliability'],
      },
      {
        ref: 'T4.5',
        title: 'Output Validation & Retry',
        description: 'Retry-with-error-feedback pattern, semantic vs syntax validation, when retries work vs when they fail, batch resubmission.',
        lessonIds: ['d4-t5-1-validation', 'd4-t5-2-retry-patterns', 'd4-t5-3-batch-processing'],
      },
      {
        ref: 'T4.6',
        title: 'Multi-Instance Review Architecture',
        description: 'Self-review limitations, independent review instances, multi-pass review (per-file + integration), confidence self-reporting.',
        lessonIds: ['d4-t6-1-review-arch', 'd4-t6-2-multi-pass', 'd4-t6-3-confidence-scoring'],
      },
    ],
  },
  {
    id: 'd5',
    code: 'D5',
    title: 'Context Management & Reliability',
    subtitle: 'Systems that don\'t fall apart under load',
    color: '#ef4444',
    bgColor: '#ef444412',
    icon: '🔒',
    tag: '15% OF EXAM',
    examWeight: '15%',
    taskCount: 6,
    lessonCount: 18,
    description: 'Context window optimization, error recovery, confidence scoring, human review workflows, token management, and source attribution. The reliability layer that makes production systems trustworthy.',
    taskStatements: [
      {
        ref: 'T5.1',
        title: 'Context Window Optimization',
        description: 'Lost-in-the-middle effect, progressive summarization risk, verbose tool output accumulation, persistent case facts blocks.',
        lessonIds: ['d5-t1-1-context-basics', 'd5-t1-2-lost-middle', 'd5-t1-3-context-strategies'],
      },
      {
        ref: 'T5.2',
        title: 'Error Recovery',
        description: 'Structured error context propagation in multi-agent systems, silent suppression anti-pattern, partial failure surfacing, recovery vs termination decisions.',
        lessonIds: ['d5-t2-1-error-propagation', 'd5-t2-2-recovery-patterns', 'd5-t2-3-partial-failure'],
      },
      {
        ref: 'T5.3',
        title: 'Confidence Scoring',
        description: 'Routing decisions based on model certainty, calibration vs raw confidence, field-level confidence output, review routing thresholds.',
        lessonIds: ['d5-t3-1-confidence-basics', 'd5-t3-2-calibration', 'd5-t3-3-routing-design'],
      },
      {
        ref: 'T5.4',
        title: 'Token Management',
        description: 'Efficient context window usage, /compact, subagent delegation for context isolation, scratchpad files, structured fact extraction.',
        lessonIds: ['d5-t4-1-token-basics', 'd5-t4-2-isolation-patterns', 'd5-t4-3-persistence'],
      },
      {
        ref: 'T5.5',
        title: 'Human Review Workflows',
        description: 'Confidence-based routing, stratified random sampling, valid vs invalid escalation triggers, structured handoff summaries.',
        lessonIds: ['d5-t5-1-escalation', 'd5-t5-2-stratified-sampling', 'd5-t5-3-handoff-design'],
      },
      {
        ref: 'T5.6',
        title: 'Source Attribution',
        description: 'Claim-source mapping that survives synthesis, contradiction detection, temporal data and publication dates, conflicting source annotation.',
        lessonIds: ['d5-t6-1-provenance', 'd5-t6-2-conflict-detection', 'd5-t6-3-synthesis-patterns'],
      },
    ],
  },
  {
    id: 'd6',
    code: 'D6',
    title: 'Cross-Domain Mastery',
    subtitle: 'Where exam points are actually won and lost',
    color: '#00e5ff',
    bgColor: '#00e5ff12',
    icon: '🎯',
    tag: 'EXAM EDGE',
    examWeight: null,
    taskCount: 6,
    lessonCount: 12,
    description: 'The interdependencies between domains that no other prep resource covers. Exam scenarios cross multiple domains — studying in isolation is insufficient. This domain makes the connections explicit.',
    taskStatements: [
      {
        ref: 'T6.1',
        title: 'D1 + D2: Agent Loops Through Tools',
        description: 'Agent loops operate through tools. Inadequate tool design breaks agentic loops. The combined failure modes and how to design for both simultaneously.',
        lessonIds: ['d6-t1-1-loop-tool-design', 'd6-t1-2-combined-failures'],
      },
      {
        ref: 'T6.2',
        title: 'D1 + D5: Error Propagation in Multi-Agent',
        description: 'Errors in multi-agent systems propagate as structured error contexts. Understanding both D1 orchestration and D5 reliability is required for correct answers.',
        lessonIds: ['d6-t2-1-error-orchestration', 'd6-t2-2-reliability-design'],
      },
      {
        ref: 'T6.3',
        title: 'D3 + D4: CLAUDE.md as System Prompting',
        description: 'CLAUDE.md hierarchy is a concrete implementation of prompt layering. Rules in CLAUDE.md are system prompts. The overlap and where each applies.',
        lessonIds: ['d6-t3-1-config-as-prompt', 'd6-t3-2-layering-strategy'],
      },
      {
        ref: 'T6.4',
        title: 'D4 + D5: Structured Output and Context',
        description: 'Structured output with JSON Schema eliminates parsing overhead and conserves context window space. Output design directly impacts reliability.',
        lessonIds: ['d6-t4-1-output-context', 'd6-t4-2-efficiency-design'],
      },
      {
        ref: 'T6.5',
        title: 'The "Two Right Answers" Pattern',
        description: 'Questions where two options both technically work but one is architecturally superior. The judgment framework that separates passing candidates from failing ones.',
        lessonIds: ['d6-t5-1-judgment-framework', 'd6-t5-2-superior-architecture'],
      },
      {
        ref: 'T6.6',
        title: 'Full Scenario Walkthroughs',
        description: 'Complete end-to-end analysis of all 6 exam scenarios, identifying which domains each tests, common traps per scenario, and the decision frameworks to apply.',
        lessonIds: ['d6-t6-1-scenario-analysis', 'd6-t6-2-scenario-strategy'],
      },
    ],
  },
];

export const DOMAIN_MAP = Object.fromEntries(DOMAINS.map(d => [d.id, d]));

export const LEVELS = [
  { level: 1, title: 'Curious',    xpNeeded: 0,    color: '#94a3b8' },
  { level: 2, title: 'Explorer',   xpNeeded: 200,  color: '#60a5fa' },
  { level: 3, title: 'Builder',    xpNeeded: 500,  color: '#34d399' },
  { level: 4, title: 'Designer',   xpNeeded: 1000, color: '#fbbf24' },
  { level: 5, title: 'Architect',  xpNeeded: 1800, color: '#f97316' },
  { level: 6, title: 'Master',     xpNeeded: 2800, color: '#e879f9' },
  { level: 7, title: 'CCA Ready',  xpNeeded: 4000, color: '#00e5ff' },
];

export function getCurrentLevel(xp: number) {
  return LEVELS.reduce((acc, l) => xp >= l.xpNeeded ? l : acc, LEVELS[0]);
}

export function getNextLevel(xp: number) {
  const cur = getCurrentLevel(xp);
  const idx = LEVELS.indexOf(cur);
  return LEVELS[idx + 1] || null;
}

export function getProgressPct(xp: number) {
  const cur = getCurrentLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  return Math.round(((xp - cur.xpNeeded) / (next.xpNeeded - cur.xpNeeded)) * 100);
}
