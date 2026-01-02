import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  executionLogs: ExecutionLog[];
  runs: Run[];
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
  addRun: (run: Run) => void;
  getRuns: () => Run[];
}

interface ExecutionLog {
  id: string;
  nodeId: string;
  status: 'running' | 'success' | 'error' | 'pending';
  message: string;
  timestamp: number;
}

export interface Run {
  id: string;
  started: number;
  duration: number;
  path: string;
  triggeredBy: string;
  tag?: string;
  status: 'running' | 'success' | 'error' | 'pending';
  kind: 'run' | 'dep';
}

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'default',
    data: { label: 'Start' },
    position: { x: 250, y: 250 },
  },
];

// Generate some sample runs for demo
const generateSampleRuns = (): Run[] => {
  const now = Date.now();
  return [
    {
      id: 'run-1',
      started: now - 4 * 60 * 1000,
      duration: 1200,
      path: 'u/admin/test_flow',
      triggeredBy: 'admin',
      status: 'success',
      kind: 'run'
    },
    {
      id: 'run-2',
      started: now - 3 * 60 * 1000,
      duration: 850,
      path: 'u/admin/data_process',
      triggeredBy: 'admin',
      status: 'success',
      kind: 'run'
    },
    {
      id: 'run-3',
      started: now - 2 * 60 * 1000,
      duration: 2100,
      path: 'u/admin/error_handler',
      triggeredBy: 'admin',
      status: 'error',
      kind: 'run'
    },
    {
      id: 'run-4',
      started: now - 1 * 60 * 1000,
      duration: 500,
      path: 'u/admin/quick_task',
      triggeredBy: 'admin',
      status: 'running',
      kind: 'run'
    }
  ];
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  selectedNode: null,
  executionLogs: [],
  runs: generateSampleRuns(),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    const newEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: newEdges });
    
    // Обновляем флаги подключения узлов после изменения рёбер
    const nodes = get().nodes.map(node => {
      const hasInput = newEdges.some(edge => edge.target === node.id);
      const hasOutput = newEdges.some(edge => edge.source === node.id);
      return {
        ...node,
        data: {
          ...node.data,
          isConnected: hasInput || hasOutput,
          hasOutput: hasOutput
        }
      };
    });
    set({ nodes });
  },

  onConnect: (connection) => {
    const newEdges = addEdge(connection, get().edges);
    set({ edges: newEdges });
    
    // Обновляем флаги подключения узлов
    const nodes = get().nodes.map(node => {
      const hasInput = newEdges.some(edge => edge.target === node.id);
      const hasOutput = newEdges.some(edge => edge.source === node.id);
      return {
        ...node,
        data: {
          ...node.data,
          isConnected: hasInput || hasOutput,
          hasOutput: hasOutput
        }
      };
    });
    set({ nodes });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (type: string, boilerplate?: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: 'default',
      data: { 
        type: type, // Сохраняем тип узла
        label: type === 'aiagent' ? 'AI Agent' : `New ${type}`, 
        code: boilerplate || '', 
        language: type === 'database' ? 'sql' : 'python',
        inputs: [],
        outputs: [{ id: 'output', label: 'Output', type: 'any' }],
        isConnected: false,
        hasOutput: false,
        // AI Agent specific fields
        subtitle: type === 'aiagent' ? 'Tools Agent' : undefined,
        chatModel: type === 'aiagent' ? false : undefined,
        memory: type === 'aiagent' ? false : undefined,
        tool: type === 'aiagent' ? false : undefined
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

  addRun: (run) => {
    set({ runs: [...get().runs, run] });
  },

  getRuns: () => {
    return get().runs;
  },
}));
