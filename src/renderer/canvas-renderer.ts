import { World } from '../engine';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error("Could not initialize 2D context");
    this.ctx = context;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  public draw(world: World): void {
    // Calculate how big each patch should be to fit the canvas
    const patchWidth = this.canvasWidth / world.width;
    const patchHeight = this.canvasHeight / world.height;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Draw the background Patches
    world.patches.forEach(patch => {
      this.ctx.fillStyle = patch.variables.pcolor || 'black';
      this.ctx.fillRect(
        patch.x * patchWidth,
        patch.y * patchHeight,
        patchWidth,
        patchHeight
      );
    });

    // Draw the Agents (Turtles)
    world.agents.forEach(agent => {
      this.ctx.fillStyle = agent.variables.color || 'yellow'; // Defaulting to yellow like the Flocking model

      this.ctx.beginPath();
      // Draw agent as a circle
      this.ctx.arc(
        agent.x * patchWidth,
        agent.y * patchHeight,
        patchWidth * 0.5, // radius
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      // Draw a line to indicate heading (direction)
      this.ctx.strokeStyle = 'black';
      this.ctx.beginPath();
      this.ctx.moveTo(agent.x * patchWidth, agent.y * patchHeight);

      const rad = agent.heading * (Math.PI / 180);
      const endX = agent.x * patchWidth + Math.cos(rad) * (patchWidth);
      const endY = agent.y * patchHeight + Math.sin(rad) * (patchHeight);

      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    });
  }
}
