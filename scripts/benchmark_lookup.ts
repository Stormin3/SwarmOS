import { MOCK_AGENTS } from "../src/data/mockAgents";

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
    const record: Record<string, typeof MOCK_AGENTS[0]> = {};
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
