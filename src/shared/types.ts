// The definitions for our visual nodes
export type NodeType =
  | 'event_setup'
  | 'event_tick'
  | 'context_ask_agents'
  | 'action_forward'
  // NODES FOR FOREST FIRE:
  | 'context_ask_neighbors4'  // Loop over 4 adjacent patches
  | 'filter_if_patch_color'   // Only execute if patch is a certain color
  | 'action_set_patch_color'  // Change patch color (e.g., green to black)
  | 'action_sprout_fire'      // Create a fire agent on the current patch
  | 'action_die'             // Kill the current agent
  // --- GENERALIZED SANDBOX NODES ---
  | 'context_ask_patches'
  | 'action_sprout'
  | 'action_set_variable';

export interface NodeData {
  id: string;
  type: NodeType;
  parameters?: Record<string, any>; // e.g., { distance: 1 }
}

// The definition for how nodes connect
export interface NodeConnection {
  sourceId: string;
  targetId: string;
  sourceHandle?: string; // e.g., "execution_out"
  targetHandle?: string; // e.g., "execution_in"
}

// The final JSON payload the Editor creates and the Engine reads
export interface SimulationAST {
  nodes: NodeData[];
  connections: NodeConnection[];
}
