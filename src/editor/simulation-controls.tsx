import React from 'react';
import { useStore } from '../shared/store';
import { forestFireNodes, forestFireEdges } from '../shared/examples';

export const SimulationControls = () => {
  const {
    isRunning, tickSpeed, togglePlay, triggerStep, triggerSetup, setSpeed,
    activeModel, loadModel
  } = useStore();

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    if (model === 'forest_fire') {
      loadModel('forest_fire', forestFireNodes, forestFireEdges);
    } else {
      loadModel('sandbox', [], []); // Clear the canvas for sandbox mode
    }
  };

  return (
    <div style={{ display: 'flex', gap: '15px', padding: '10px 20px', background: '#333', borderBottom: '2px solid #444', alignItems: 'center', color: 'white' }}>

      {/* EXAMPLES DROPDOWN */}
      <select
        value={activeModel}
        onChange={handleModelChange}
        style={{ padding: '8px', borderRadius: '4px', background: '#222', color: 'white', border: '1px solid #555', fontWeight: 'bold' }}
      >
        <option value="sandbox">Sandbox (Custom)</option>
        <option value="forest_fire">Example: Forest Fire</option>
      </select>

      <div style={{ width: '2px', height: '30px', background: '#555', margin: '0 10px' }}></div>

      <button onClick={triggerSetup} style={{ padding: '8px 15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        Setup (Reset)
      </button>

      <button onClick={togglePlay} style={{ padding: '8px 15px', background: isRunning ? '#fbc02d' : '#388e3c', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        {isRunning ? 'Pause' : 'Go'}
      </button>

      <button onClick={triggerStep} disabled={isRunning} style={{ padding: '8px 15px', background: isRunning ? '#555' : '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: isRunning ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
        Tick (Step)
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
        <label>Speed: {tickSpeed} fps</label>
        <input type="range" min="1" max="60" value={tickSpeed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
      </div>
    </div>
  );
};
