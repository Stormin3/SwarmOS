export const MOCK_AGENTS = [
  { id: "hr-expert-001", name: "Eleanor Vance" },
  { id: "dev-lead-002", name: "Marcus Chen" },
  { id: "sales-rep-003", name: "Sarah Jenkins" },
  { id: "data-analyst-004", name: "David Kim" },
  { id: "research-scientist-005", name: "Dr. Evelyn Thorne" },
  { id: "devops-engineer-006", name: "Alex Mercer" },
  { id: "customer-success-007", name: "Maya Patel" },
  { id: "cybersecurity-analyst-008", name: "Victor Vance" },
];

const ITERATIONS = 1_000_000;
const agentIds = MOCK_AGENTS.map(a => a.id);

function benchmarkFind() {
  console.time("MOCK_AGENTS.find");
  for (let i = 0; i < ITERATIONS; i++) {
    const id = agentIds[i % agentIds.length];
    const agent = MOCK_AGENTS.find(a => a.id === id);
  }
  console.timeEnd("MOCK_AGENTS.find");
}

function benchmarkMap() {
  const map = new Map(MOCK_AGENTS.map(a => [a.id, a]));
  console.time("MOCK_AGENTS_MAP.get");
  for (let i = 0; i < ITERATIONS; i++) {
    const id = agentIds[i % agentIds.length];
    const agent = map.get(id);
  }
  console.timeEnd("MOCK_AGENTS_MAP.get");
}

function benchmarkRecord() {
    const record = {};
    MOCK_AGENTS.forEach(a => { record[a.id] = a; });
    console.time("MOCK_AGENTS_RECORD[id]");
    for (let i = 0; i < ITERATIONS; i++) {
      const id = agentIds[i % agentIds.length];
      const agent = record[id];
    }
    console.timeEnd("MOCK_AGENTS_RECORD[id]");
  }

console.log(`Running benchmarks with ${ITERATIONS.toLocaleString()} iterations...`);
benchmarkFind();
benchmarkMap();
benchmarkRecord();
