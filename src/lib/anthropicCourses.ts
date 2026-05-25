export interface AnthropicCourse {
  id:          string;
  title:       string;
  tagline:     string;
  description: string;
  audience:    string;
  lessonCount: number;
  duration:    string;
  level:       'Beginner' | 'Intermediate' | 'Advanced';
  icon:        string;
  color:       string;
  url:         string;
  topics:      string[];
}

export const ANTHROPIC_COURSES: AnthropicCourse[] = [
  {
    id: 'claude-101',
    title: 'Claude 101',
    tagline: 'Foundations of Claude — start here',
    description: 'The first course in Anthropic Academy. Introduces what Claude is, how it works, what makes it different, and how to use it effectively in everyday workflows.',
    audience: 'Anyone new to Claude. No coding required.',
    lessonCount: 13,
    duration: '~2 hours',
    level: 'Beginner',
    icon: '🎓',
    color: '#06b6d4',
    url: 'https://anthropic.skilljar.com/claude-101',
    topics: ['What Claude is', 'Prompting basics', 'Conversation patterns', 'Use cases'],
  },
  {
    id: 'ai-fluency',
    title: 'AI Fluency: Framework & Foundations',
    tagline: 'Work effectively with AI as a teammate',
    description: 'Anthropic\'s 4-D framework (Delegation, Description, Discernment, Diligence) for working with AI productively, ethically, and safely. Less about a specific model — more about how to think about working alongside AI.',
    audience: 'Knowledge workers, students, anyone integrating AI into their work.',
    lessonCount: 13,
    duration: '~3 hours',
    level: 'Beginner',
    icon: '🧭',
    color: '#8b5cf6',
    url: 'https://www.anthropic.com/ai-fluency',
    topics: ['The 4 D\'s', 'Delegation', 'Prompt design', 'Evaluation', 'Responsible use'],
  },
  {
    id: 'claude-code-in-action',
    title: 'Claude Code in Action',
    tagline: 'Hands-on with the Claude Code CLI',
    description: 'Practical training on Claude Code — the agentic coding CLI. Configuration, slash commands, hooks, MCP servers, multi-agent workflows, and real engineering use cases. Direct prep for the agent-tool portions of CCA.',
    audience: 'Developers and engineers using or evaluating Claude Code.',
    lessonCount: 15,
    duration: '~4 hours',
    level: 'Intermediate',
    icon: '⚡',
    color: '#f59e0b',
    url: 'https://anthropic.skilljar.com/claude-code-in-action',
    topics: ['CLI setup', 'Slash commands & skills', 'Hooks', 'MCP', 'CI/CD', 'Multi-agent'],
  },
];

export const ANTHROPIC_ACADEMY_URL = 'https://anthropic.skilljar.com/';
