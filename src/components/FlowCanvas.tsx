import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowStore } from '../store/flowStore';
import { CustomNode } from './CustomNode';

const nodeTypes = {
  default: CustomNode,
};

interface FlowCanvasProps {
  onNodeClick: (node: any) => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({ onNodeClick }) => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode
  } = useFlowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const boilerplate = event.dataTransfer.getData('application/boilerplate');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      addNode(type, boilerplate);
    },
    [addNode]
  );

  return (
    <div className="flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick(node)}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="rgba(255, 255, 255, 0.05)" />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'input':
                return '#10b981';
              case 'output':
                return '#ef4444';
              default:
                return '#3b82f6';
            }
          }}
          pannable
          zoomable
        />
        <Panel position="top-left" className="flow-panel">
          <div className="flow-info">
            <span className="flow-info-label">Режим:</span>
            <span className="flow-info-value">Редактирование</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
