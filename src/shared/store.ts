import { create } from 'zustand';
import type { Connection, Edge, EdgeChange, Node, NodeChange, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { SimulationAST, NodeType } from './types';

const generateId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

interface ABMState {
  // --- NODE EDITOR STATE ---
  nodes: Node[];
  edges: Edge[];
  activeModel: string; // Tracks which model is currently loaded

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, newData: any) => void;
  addNode: (type: NodeType, position: { x: number, y: number }) => void;
  loadModel: (modelId: string, initialNodes: Node[], initialEdges: Edge[]) => void;
  getAST: () => SimulationAST;

  // --- SIMULATION CONTROLS STATE ---
  isRunning: boolean;
  tickSpeed: number; // Ticks per second (1 to 60)
  shouldStep: boolean; // Flag for a single tick step
  shouldSetup: boolean; // Flag to reset/setup the world

  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  triggerStep: () => void;
  triggerSetup: () => void;
  consumeStep: () => void;
  consumeSetup: () => void;
}

export const useStore = create<ABMState>((set, get) => ({
  nodes: [],
  edges: [],
  activeModel: 'sandbox', // Defaults to an empty sandbox

  onNodesChange: (changes: NodeChange[]) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes: EdgeChange[]) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection: Connection) => set({ edges: addEdge({ ...connection, animated: true }, get().edges) }),
  updateNodeData: (nodeId: string, newData: any) => {
    set({ nodes: get().nodes.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, parameters: { ...node.data.parameters || {}, ...newData } } } : node) });
  },
  addNode: (type: NodeType, position: { x: number, y: number }) => {
    set({ nodes: [...get().nodes, { id: generateId(), type, position, data: { label: type.replace(/_/g, ' ').toUpperCase() } }] });
  },
  getAST: (): SimulationAST => {
    const { nodes, edges } = get();
    return {
      nodes: nodes.map(n => ({ id: n.id, type: n.type as any, parameters: n.data?.parameters || {} })),
      connections: edges.map(e => ({ sourceId: e.source, targetId: e.target, sourceHandle: e.sourceHandle ?? undefined, targetHandle: e.targetHandle ?? undefined }))
    };
  },

  // Loads a pre-built graph and triggers a world reset
  loadModel: (modelId: string, initialNodes: Node[], initialEdges: Edge[]) => {
    set({
      activeModel: modelId,
      nodes: initialNodes,
      edges: initialEdges,
      shouldSetup: true, // Automatically reset the world when a new model loads
      isRunning: false   // Pause the simulation
    });
  },

  // --- SIMULATION CONTROLS IMPLEMENTATION ---
  isRunning: false,
  tickSpeed: 15,
  shouldStep: false,
  shouldSetup: false,

  togglePlay: () => set((state) => ({ isRunning: !state.isRunning })),
  setSpeed: (tickSpeed: number) => set({ tickSpeed }),
  triggerStep: () => set({ shouldStep: true, isRunning: false }), // Pauses if running, sets step flag
  triggerSetup: () => set({ shouldSetup: true, isRunning: false }), // Pauses and resets
  consumeStep: () => set({ shouldStep: false }),
  consumeSetup: () => set({ shouldSetup: false }),
}));
