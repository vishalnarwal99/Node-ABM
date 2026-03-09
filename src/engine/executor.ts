import { World, Agent, Patch } from './index';
import { type SimulationAST, type NodeData } from '../shared/types';

export class Executor {

  // Helper to find a node by its ID
  private getNode(ast: SimulationAST, id: string): NodeData | undefined {
    return ast.nodes.find(n => n.id === id);
  }

  // Helper to find the next node connected to a specific handle
  private getNextNode(ast: SimulationAST, sourceId: string, handle: string = 'execution_out'): NodeData | undefined {
    const connection = ast.connections.find(
      c => c.sourceId === sourceId && c.sourceHandle === handle
    );
    if (!connection) return undefined;
    return this.getNode(ast, connection.targetId);
  }

  // Notice we now pass the AST in every tick!
  public executeTick(world: World, ast: SimulationAST): void {
    const tickNode = ast.nodes.find(n => n.type === 'event_tick');
    if (!tickNode) return;

    const nextNode = this.getNextNode(ast, tickNode.id);
    if (nextNode) {
      this.executeNode(ast, nextNode, world);
    }
  }

  // The recursive execution engine now carries the AST forward
  private executeNode(ast: SimulationAST, node: NodeData, world: World, currentAgent?: Agent, currentPatch?: Patch): void {
    switch (node.type) {
      case 'context_ask_agents': {
        const bodyNode = this.getNextNode(ast, node.id, 'loop_body');
        if (bodyNode) {
          world.agents.forEach(agent => {
            this.executeNode(ast, bodyNode, world, agent);
          });
        }

        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent);
        break;
      }

      case 'action_forward': {
        if (currentAgent) {
          const distance = node.parameters?.distance || 1;
          currentAgent.forward(distance);
        }

        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent);
        break;
      }

      case 'context_ask_neighbors4': {
        // Find the patch we are currently standing on
        const originPatch = currentPatch || (currentAgent ? world.getPatch(currentAgent.x, currentAgent.y) : undefined);

        if (originPatch) {
          const neighbors = originPatch.getNeighbors4(world); //
          const bodyNode = this.getNextNode(ast, node.id, 'loop_body');

          if (bodyNode) {
            neighbors.forEach(neighborPatch => {
              this.executeNode(ast, bodyNode, world, currentAgent, neighborPatch);
            });
          }
        }

        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent, currentPatch);
        break;
      }

      case 'filter_if_patch_color': {
        const targetColor = node.parameters?.color || 'green';

        // If the patch is the target color, execute the "True" branch
        if (currentPatch && currentPatch.variables.pcolor === targetColor) {
          const trueNode = this.getNextNode(ast, node.id, 'true_body');
          if (trueNode) this.executeNode(ast, trueNode, world, currentAgent, currentPatch);
        }

        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent, currentPatch);
        break;
      }

      case 'action_set_patch_color': {
        if (currentPatch) {
          currentPatch.variables.pcolor = node.parameters?.color || 'black'; //
        }
        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent, currentPatch);
        break;
      }

      case 'action_sprout_fire': {
        if (currentPatch) {
          world.sprout(currentPatch, { color: 'red', type: 'fire' }); //
        }
        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent, currentPatch);
        break;
      }

      case 'action_die': {
        if (currentAgent) {
          currentAgent.die(); //
        }
        // Usually, execution stops for this agent after it dies.
        break;
      }

      // Loops over every single patch on the grid
      case 'context_ask_patches': {
        const bodyNode = this.getNextNode(ast, node.id, 'loop_body');
        if (bodyNode) {
          // Iterate through the Map of patches
          world.patches.forEach(patch => {
            // Notice we pass the 'patch' as the current context, not an agent!
            this.executeNode(ast, bodyNode, world, undefined, patch);
          });
        }

        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent, currentPatch);
        break;
      }

      // Spawns a generic agent on the current patch
      case 'action_sprout': {
        if (currentPatch) {
          const count = node.parameters?.count || 1;
          for (let i = 0; i < count; i++) {
            // We'll default to yellow so they show up brightly on the black canvas
            world.sprout(currentPatch, { color: 'yellow' });
          }
        }

        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent, currentPatch);
        break;
      }

      // Sets a variable on the current agent or patch
      case 'action_set_variable': {
        const varName = node.parameters?.varName;
        const value = node.parameters?.value;

        if (varName && value !== undefined) {
          // If we are currently "asking" an agent, set it on the agent
          if (currentAgent) {
            currentAgent.variables[varName] = value;
          }
          // Otherwise, if we are "asking" a patch, set it on the patch
          else if (currentPatch) {
            currentPatch.variables[varName] = value;
          }
        }

        const nextNode = this.getNextNode(ast, node.id, 'execution_out');
        if (nextNode) this.executeNode(ast, nextNode, world, currentAgent, currentPatch);
        break;
      }
    }
  }

  // Run the "Setup" visual logic chain
  public executeSetup(world: World, ast: SimulationAST): void {
    world.clearAll(); // Always clear the world on setup

    // Find the "Setup" event node instead of the "Tick" node
    const setupNode = ast.nodes.find(n => n.type === 'event_setup');
    if (!setupNode) return;

    const nextNode = this.getNextNode(ast, setupNode.id);
    if (nextNode) {
      this.executeNode(ast, nextNode, world);
    }
  }
}