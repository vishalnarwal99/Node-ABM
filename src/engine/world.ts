import { Patch } from './patch';
import { Agent } from './agent';

export class World {
  public width: number;
  public height: number;
  public ticks: number = 0;

  public patches: Map<string, Patch> = new Map();
  public agents: Agent[] = [];
  public globals: Record<string, any> = {}; // For global variables like 'percent-similar'

  private agentIdCounter: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.setupGrid();
  }

  // Creates the background grid of patches
  private setupGrid(): void {
    this.patches.clear();
    // Replicating NetLogo's typical coordinate system (0,0 is usually center, but
    // for standard web rendering, top-left or bottom-left as 0,0 is easier).
    // We'll use 0 to width-1, 0 to height-1.
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.patches.set(`${x},${y}`, new Patch(x, y));
      }
    }
  }

  // Safely fetch a patch, handling wrap-around (torus topology)
  public getPatch(x: number, y: number): Patch | undefined {
    // Wrap coordinates (e.g., moving off the right edge loops to the left edge)
    const wrappedX = (Math.round(x) + this.width) % this.width;
    const wrappedY = (Math.round(y) + this.height) % this.height;
    return this.patches.get(`${wrappedX},${wrappedY}`);
  }

  // Spawns new agents (replicates NetLogo's 'create-turtles')
  public createAgents(count: number): void {
    for (let i = 0; i < count; i++) {
      // Random placement
      const startX = Math.random() * this.width;
      const startY = Math.random() * this.height;
      const agent = new Agent(`agent_${this.agentIdCounter++}`, startX, startY);
      this.agents.push(agent);
    }
  }

  // Sprouts a new agent exactly on a given patch
  public sprout(patch: Patch, variables: Record<string, any> = {}): Agent {
    const agent = new Agent(`agent_${this.agentIdCounter++}`, patch.x, patch.y);
    agent.variables = { ...variables };
    this.agents.push(agent);
    return agent;
  }

  // The main execution loop
  public tick(): void {
    this.ticks++;
    // Clean up dead agents from the previous tick
    this.agents = this.agents.filter(a => !a.isDead);
  }

  public clearAll(): void {
    this.agents = [];
    this.ticks = 0;
    this.globals = {};
    this.setupGrid();
  }
}
