import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  executionLogs: ExecutionLog[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: string, boilerplate?: string) => void;
  updateNode: (id: string, data: any) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (node: Node | null) => void;
  addExecutionLog: (log: ExecutionLog) => void;
  clearExecutionLogs: () => void;
}

interface ExecutionLog {
  id: string;
  nodeId: string;
  status: 'running' | 'success' | 'error' | 'pending';
  message: string;
  timestamp: number;
}

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'default',
    data: { label: 'Start' },
    position: { x: 250, y: 250 },
  },
];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  selectedNode: null,
  executionLogs: [],

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (type: string, boilerplate?: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: 'default',
      data: { 
        label: `New ${type}`, 
        code: boilerplate || '', 
        language: type === 'database' ? 'sql' : 'python',
        inputs: [],
        outputs: [{ id: 'output', label: 'Output', type: 'any' }]
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
    });
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  addExecutionLog: (log) => {
    set({ executionLogs: [...get().executionLogs, log] });
  },

  clearExecutionLogs: () => {
    set({ executionLogs: [] });
  },
}));
