import { useEffect, useRef } from 'react';
import { World, Executor } from './engine';
import { CanvasRenderer } from './renderer/canvas-renderer';
import { NodeEditor } from './editor/node-editor';
import { Sidebar } from './editor/sidebar';
import { SimulationControls } from './editor/simulation-controls';
import { useStore } from './shared/store';
import './index.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const world = new World(50, 50);
    const renderer = new CanvasRenderer(canvasRef.current);
    const executor = new Executor();

    let animationFrameId: number;
    let lastExecutionTime = 0;

    const loop = (timestamp: number) => {
      const state = useStore.getState();
      const liveAST = state.getAST();

      // Handle "Setup / Reset"
      if (state.shouldSetup) {
        world.clearAll(); // Always clear the board first

        if (state.activeModel === 'forest_fire') {
          // FOREST FIRE HARDCODED SETUP
          const DENSITY = 60;
          world.patches.forEach(patch => {
            if (Math.random() * 100 < DENSITY) {
              patch.variables.pcolor = 'green';
            }
            if (patch.x === 0 && patch.variables.pcolor === 'green') {
              patch.variables.pcolor = 'black';
              world.sprout(patch, { color: 'red', type: 'fire' });
            }
          });
        } else {
          // SANDBOX DYNAMIC SETUP (Reads from the [On Setup] node)
          executor.executeSetup(world, liveAST);
        }

        renderer.draw(world);
        state.consumeSetup();
      }

      // Handle Time/Throttle based on Tick Speed Slider
      const delayMs = 1000 / state.tickSpeed;

      if (timestamp - lastExecutionTime > delayMs) {
        // Execute Tick if Playing OR if user manually clicked "Step"
        if (state.isRunning || state.shouldStep) {
          world.tick();
          executor.executeTick(world, liveAST);
          renderer.draw(world);

          if (state.shouldStep) state.consumeStep();
          lastExecutionTime = timestamp;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#222' }}>
      <Sidebar />

      <div style={{ flex: 1, borderRight: '2px solid #444', borderLeft: '2px solid #444', display: 'flex', flexDirection: 'column' }}>
        {/* Playback Controls Toolbar */}
        <SimulationControls />
        {/* Node Editor */}
        <div style={{ flex: 1 }}>
          <NodeEditor />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <canvas ref={canvasRef} width={600} height={600} style={{ backgroundColor: 'black', border: '1px solid #555', imageRendering: 'pixelated' }} />
      </div>
    </div>
  );
}

export default App;
