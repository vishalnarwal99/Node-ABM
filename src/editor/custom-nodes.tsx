import { Handle, Position } from '@xyflow/react';
import { useStore } from '../shared/store';

// ---------------------------------------------------------
// EVENT & CONTEXT NODES (The Loops)
// ---------------------------------------------------------

export const EventNode = ({ data }: { data: any }) => (
  <div style={{ background: '#d32f2f', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
    <strong>{data.label}</strong>
    <Handle type="source" position={Position.Right} id="execution_out" />
  </div>
);

export const ContextNode = ({ data }: { data: any }) => (
  <div style={{ background: '#1976d2', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
    <Handle type="target" position={Position.Left} id="execution_in" style={{ top: '50%' }} />
    <strong>{data.label}</strong>
    <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '10px' }}>Loop Body️</div>
    <Handle type="source" position={Position.Right} id="loop_body" style={{ top: '60%', background: '#ffeb3b' }} />
    <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '5px' }}>Next️</div>
    <Handle type="source" position={Position.Right} id="execution_out" style={{ top: '85%' }} />
  </div>
);

// Ask Neighbors4 looks similar to a context node, but specifically for patches
export const Neighbors4Node = ({ data }: { data: any }) => (
  <div style={{ background: '#0288d1', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
    <Handle type="target" position={Position.Left} id="execution_in" style={{ top: '50%' }} />
    <strong>{data.label}</strong>
    <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '10px' }}>For Each Neighbor️</div>
    <Handle type="source" position={Position.Right} id="loop_body" style={{ top: '60%', background: '#ffeb3b' }} />
    <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '5px' }}>Done️</div>
    <Handle type="source" position={Position.Right} id="execution_out" style={{ top: '85%' }} />
  </div>
);

// ---------------------------------------------------------
// FILTER NODES (Logic Gates)
// ---------------------------------------------------------

export const IfColorNode = ({ id, data }: { id: string, data: any }) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div style={{ background: '#7b1fa2', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
      <Handle type="target" position={Position.Left} id="execution_in" style={{ top: '50%' }} />
      <strong>If Patch Color:</strong>
      <select
        className="nodrag"
        defaultValue={data.parameters?.color || 'green'}
        onChange={(e) => updateNodeData(id, { color: e.target.value })}
        style={{ marginTop: '5px', width: '100%', color: 'black' }}
      >
        <option value="green">Green (Tree)</option>
        <option value="black">Black (Empty/Burned)</option>
        <option value="red">Red (Fire)</option>
      </select>

      <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '10px' }}>True️</div>
      <Handle type="source" position={Position.Right} id="true_body" style={{ top: '70%', background: '#00e676' }} />
      <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '5px' }}>Next️</div>
      <Handle type="source" position={Position.Right} id="execution_out" style={{ top: '90%' }} />
    </div>
  );
};

// ---------------------------------------------------------
// ACTION NODES (Changing the World)
// ---------------------------------------------------------

export const SetColorNode = ({ id, data }: { id: string, data: any }) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div style={{ background: '#388e3c', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
      <Handle type="target" position={Position.Left} id="execution_in" />
      <strong>Set Patch Color:</strong>
      <select
        className="nodrag"
        defaultValue={data.parameters?.color || 'black'}
        onChange={(e) => updateNodeData(id, { color: e.target.value })}
        style={{ marginTop: '5px', width: '100%', color: 'black' }}
      >
        <option value="black">Black</option>
        <option value="green">Green</option>
        <option value="red">Red</option>
      </select>
      <Handle type="source" position={Position.Right} id="execution_out" />
    </div>
  );
};

export const SproutFireNode = ({ data }: { data: any }) => (
  <div style={{ background: '#f57c00', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
    <Handle type="target" position={Position.Left} id="execution_in" />
    <strong>{data.label}</strong>
    <Handle type="source" position={Position.Right} id="execution_out" />
  </div>
);

export const DieNode = ({ data }: { data: any }) => (
  <div style={{ background: '#424242', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
    <Handle type="target" position={Position.Left} id="execution_in" />
    <strong>{data.label}</strong>
    <Handle type="source" position={Position.Right} id="execution_out" />
  </div>
);

// Generalized Event Setup
export const EventSetupNode = () => (
  <div style={{ background: '#c2185b', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
    <strong>On Setup</strong>
    <Handle type="source" position={Position.Right} id="execution_out" />
  </div>
);

// Generalized Context: Ask Patches
export const AskPatchesNode = () => (
  <div style={{ background: '#0288d1', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
    <Handle type="target" position={Position.Left} id="execution_in" style={{ top: '50%' }} />
    <strong>Ask All Patches</strong>
    <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '10px' }}>Loop Body️</div>
    <Handle type="source" position={Position.Right} id="loop_body" style={{ top: '60%', background: '#ffeb3b' }} />
    <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '5px' }}>Next️</div>
    <Handle type="source" position={Position.Right} id="execution_out" style={{ top: '85%' }} />
  </div>
);

// Generalized Action: Sprout (Replaces Sprout Fire)
export const SproutNode = ({ id, data }: { id: string, data: any }) => {
  const updateNodeData = useStore((state) => state.updateNodeData);
  return (
    <div style={{ background: '#f57c00', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
      <Handle type="target" position={Position.Left} id="execution_in" />
      <strong>Sprout Agent</strong>
      <div style={{ marginTop: '5px', fontSize: '12px' }}>
        <label>Count: </label>
        <input
          type="number" defaultValue={data.parameters?.count || 1}
          onChange={(e) => updateNodeData(id, { count: parseInt(e.target.value) })}
          style={{ width: '50px', color: 'black' }} className="nodrag"
        />
      </div>
      <Handle type="source" position={Position.Right} id="execution_out" />
    </div>
  );
};

// Set Variable (Essential for Segregation logic like 'set happy?')
export const SetVariableNode = ({ id, data }: { id: string, data: any }) => {
  const updateNodeData = useStore((state) => state.updateNodeData);
  return (
    <div style={{ background: '#689f38', color: 'white', padding: '10px', borderRadius: '5px', minWidth: '150px' }}>
      <Handle type="target" position={Position.Left} id="execution_in" />
      <strong>Set Variable</strong>
      <input
        type="text" placeholder="Variable Name" defaultValue={data.parameters?.varName}
        onChange={(e) => updateNodeData(id, { varName: e.target.value })}
        style={{ width: '100%', color: 'black', marginTop: '5px' }} className="nodrag"
      />
      <input
        type="text" placeholder="Value (or JS Math)" defaultValue={data.parameters?.value}
        onChange={(e) => updateNodeData(id, { value: e.target.value })}
        style={{ width: '100%', color: 'black', marginTop: '5px' }} className="nodrag"
      />
      <Handle type="source" position={Position.Right} id="execution_out" />
    </div>
  );
};

// Map the AST types to the React components
export const nodeTypes = {
  event_tick: EventNode,
  context_ask_agents: ContextNode,
  context_ask_neighbors4: Neighbors4Node,
  filter_if_patch_color: IfColorNode,
  action_set_patch_color: SetColorNode,
  action_sprout_fire: SproutFireNode,
  action_die: DieNode,
  event_setup: EventSetupNode,
  context_ask_patches: AskPatchesNode,
  action_sprout: SproutNode,
  action_set_variable: SetVariableNode,
};
