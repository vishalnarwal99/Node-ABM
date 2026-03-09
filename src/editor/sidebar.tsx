import React from 'react';
import { type NodeType } from '../shared/types';

// The list of available generalized nodes
const availableNodes: { type: NodeType; label: string; color: string }[] = [
  { type: 'event_tick', label: 'On Tick', color: '#d32f2f' },
  { type: 'context_ask_agents', label: 'Ask Turtles', color: '#1976d2' },
  { type: 'context_ask_neighbors4', label: 'Ask Neighbors', color: '#0288d1' },
  { type: 'filter_if_patch_color', label: 'If Color', color: '#7b1fa2' },
  { type: 'action_set_patch_color', label: 'Set Color', color: '#388e3c' },
  { type: 'action_sprout_fire', label: 'Sprout Agent', color: '#f57c00' },
  { type: 'action_forward', label: 'Forward', color: '#388e3c' },
  { type: 'action_die', label: 'Die', color: '#424242' },
  { type: 'event_setup', label: 'On Setup', color: '#d32f2f' },
  { type: 'context_ask_patches', label: 'Ask Patches', color: '#689f38' },
  { type: 'action_sprout', label: 'Sprout (General)', color: '#f57c00' },
  { type: 'action_set_variable', label: 'Set Variable', color: '#689f38' },
];

export const Sidebar = () => {
  // Sets up the HTML5 drag event payload
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ width: '250px', background: '#333', color: 'white', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Node Library</h3>
      <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 15px 0' }}>Drag nodes onto the canvas.</p>

      {availableNodes.map((node) => (
        <div
          key={node.type}
          onDragStart={(event) => onDragStart(event, node.type)}
          draggable
          style={{
            background: node.color,
            padding: '10px',
            borderRadius: '5px',
            cursor: 'grab',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
};
