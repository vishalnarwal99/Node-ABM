import type { Node, Edge } from '@xyflow/react';

export const forestFireNodes: Node[] = [
  { id: '1', type: 'event_tick', position: { x: 50, y: 150 }, data: { label: 'On Tick' } },
  { id: '2', type: 'context_ask_agents', position: { x: 250, y: 130 }, data: { label: 'Ask Agents (Fires)' } },
  { id: '3', type: 'context_ask_neighbors4', position: { x: 500, y: 50 }, data: { label: 'Ask Neighbors4' } },
  { id: '4', type: 'filter_if_patch_color', position: { x: 750, y: -50 }, data: { label: 'If Color', parameters: { color: 'green' } } },
  { id: '5', type: 'action_set_patch_color', position: { x: 1000, y: -50 }, data: { label: 'Set Color', parameters: { color: 'black' } } },
  { id: '6', type: 'action_sprout_fire', position: { x: 1250, y: -50 }, data: { label: 'Sprout Fire' } },
  { id: '7', type: 'action_die', position: { x: 750, y: 200 }, data: { label: 'Die (Become Ember)' } }
];

export const forestFireEdges: Edge[] = [
  { id: 'e1-2', source: '1', sourceHandle: 'execution_out', target: '2', targetHandle: 'execution_in', animated: true },
  { id: 'e2-3', source: '2', sourceHandle: 'loop_body', target: '3', targetHandle: 'execution_in', animated: true },
  { id: 'e3-4', source: '3', sourceHandle: 'loop_body', target: '4', targetHandle: 'execution_in', animated: true },
  { id: 'e4-5', source: '4', sourceHandle: 'true_body', target: '5', targetHandle: 'execution_in', animated: true },
  { id: 'e5-6', source: '5', sourceHandle: 'execution_out', target: '6', targetHandle: 'execution_in', animated: true },
  { id: 'e3-7', source: '3', sourceHandle: 'execution_out', target: '7', targetHandle: 'execution_in', animated: true }
];
