import { describe, it, expect } from 'vitest';
import { MOCK_AGENTS } from './mockAgents';

describe('MOCK_AGENTS', () => {
  it('should be an array of agents', () => {
    expect(Array.isArray(MOCK_AGENTS)).toBe(true);
    expect(MOCK_AGENTS.length).toBeGreaterThan(0);
  });

  it('should have required properties for each agent', () => {
    MOCK_AGENTS.forEach(agent => {
      expect(agent).toHaveProperty('id');
      expect(typeof agent.id).toBe('string');

      expect(agent).toHaveProperty('name');
      expect(typeof agent.name).toBe('string');

      expect(agent).toHaveProperty('role');
      expect(typeof agent.role).toBe('string');

      expect(agent).toHaveProperty('department');
      expect(typeof agent.department).toBe('string');

      expect(agent).toHaveProperty('avatarUrl');
      expect(typeof agent.avatarUrl).toBe('string');

      expect(agent).toHaveProperty('voice');
      expect(['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr']).toContain(agent.voice);

      expect(agent).toHaveProperty('status');
      expect(['active', 'idle', 'offline']).toContain(agent.status);

      expect(agent).toHaveProperty('skills');
      expect(Array.isArray(agent.skills)).toBe(true);

      expect(agent).toHaveProperty('parameters');
      expect(typeof agent.parameters.temperature).toBe('number');
      expect(typeof agent.parameters.topP).toBe('number');
      expect(typeof agent.parameters.topK).toBe('number');

      expect(agent).toHaveProperty('expectations');
      expect(Array.isArray(agent.expectations)).toBe(true);

      expect(agent).toHaveProperty('restrictions');
      expect(Array.isArray(agent.restrictions)).toBe(true);

      expect(agent).toHaveProperty('systemPrompt');
      expect(typeof agent.systemPrompt).toBe('string');
    });
  });

  it('should have unique ids', () => {
    const ids = MOCK_AGENTS.map(agent => agent.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
