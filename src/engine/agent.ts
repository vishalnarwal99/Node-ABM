export class Agent {
  public id: string;
  public x: number;
  public y: number;
  public heading: number; // Degrees (0-360), where 0 is East/Right
  public variables: Record<string, any>; // Stores 'color', 'happy?', 'flockmates', etc.
  public isDead: boolean = false; // For future use in models like Segregation

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.heading = Math.random() * 360; // Random starting direction
    this.variables = {};
  }

  // Moves the agent forward based on its current heading (Crucial for Flocking)
  forward(distance: number): void {
    // Convert degrees to radians for JS Math functions
    const radians = this.heading * (Math.PI / 180);
    this.x += Math.cos(radians) * distance;
    this.y += Math.sin(radians) * distance;
  }

  // Turns the agent right (Crucial for Flocking steering rules)
  right(degrees: number): void {
    this.heading = (this.heading + degrees) % 360;
  }

  // Turns the agent left
  left(degrees: number): void {
    this.heading = (this.heading - degrees + 360) % 360;
  }

  // Snaps the agent to a specific patch (Crucial for Segregation)
  moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  die(): void {
    this.isDead = true;
  }
}
