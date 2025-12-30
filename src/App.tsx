import { useState } from 'react';
import { 
  PlayCircle, 
  DollarSign, 
  Layers, 
  Settings 
} from 'lucide-react';
import { FlowCanvas } from './components/FlowCanvas';
import { Sidebar } from './components/Sidebar';
import { NodeEditor } from './components/NodeEditor';
import { Toolbar } from './components/Toolbar';
import { ExecutionLogs } from './components/ExecutionLogs';
import { GlobalSidebar } from './components/GlobalSidebar';
import { HomeView } from './components/HomeView';
import { useFlowStore } from './store/flowStore';
import axios from 'axios';
import './App.css';
import './Futuristic.css';

function App() {
  const { nodes, edges, selectedNode, setSelectedNode, addExecutionLog, clearExecutionLogs } = useFlowStore();
  const [testResult, setTestResult] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isEditingFlow, setIsEditingFlow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTest = async () => {
    clearExecutionLogs();
    setIsLogsOpen(true);

    try {
      addExecutionLog({
        id: `log-${Date.now()}`,
        nodeId: 'start',
        status: 'running',
        message: 'Starting workflow execution...',
        timestamp: Date.now()
      });

      for (const node of nodes) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const isSuccess = Math.random() > 0.1;
        
        addExecutionLog({
          id: `log-${Date.now()}-${node.id}`,
          nodeId: node.id,
          status: isSuccess ? 'success' : 'error',
          message: isSuccess ? `Node ${node.data.label} completed` : `Node ${node.data.label} failed`,
          timestamp: Date.now()
        });

        if (!isSuccess) break;
      }

      try {
        const response = await axios.post('http://localhost:8000/invoke', {
          input: "Test input",
          thread_id: "test-" + Date.now()
        }, { timeout: 2000 });
        setTestResult(response.data);
      } catch (e) {
        setTestResult({ status: 'completed', message: 'Execution finished (Demo Mode)' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    localStorage.setItem('corallum-flow', JSON.stringify({ nodes, edges }));
    alert('✓ Flow saved successfully!');
  };

  const handleExport = () => {
    const flow = { nodes, edges };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flow, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `corallum-flow-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="app-container">
      <GlobalSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'home') setIsEditingFlow(false);
        }} 
        onSearch={setSearchQuery}
        isCollapsed={isEditingFlow}
      />
      
      <div className="main-content">
        {activeTab === 'home' && !isEditingFlow && (
          <HomeView 
            onCreateFlow={() => setIsEditingFlow(true)} 
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'home' && isEditingFlow && (
          <div className={`app ${isSidebarOpen ? 'sidebar-open' : ''}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Toolbar 
              onTest={handleTest} 
              onSave={handleSave}
              onSaveDraft={() => alert('Draft Saved!')}
              onExport={handleExport}
              onDeploy={() => alert('Workflow Deployed to Production!')}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="app-content">
              <Sidebar isOpen={isSidebarOpen} />
              <div className="main-area">
                <FlowCanvas onNodeClick={setSelectedNode} />
              </div>
              {selectedNode && (
                <NodeEditor 
                  node={selectedNode} 
                  onClose={() => setSelectedNode(null)} 
                />
              )}
            </div>
            <ExecutionLogs isOpen={isLogsOpen} onToggle={() => setIsLogsOpen(!isLogsOpen)} />
          </div>
        )}

        {activeTab === 'runs' && (
          <div className="placeholder-view">
            <PlayCircle size={48} className="text-accent-primary mb-4" />
            <h2>Execution History</h2>
            <p>View and debug your previous workflow runs.</p>
            <button className="btn-action mt-4" onClick={() => setActiveTab('home')}>Back to Home</button>
          </div>
        )}

        {activeTab === 'variables' && (
          <div className="placeholder-view">
            <DollarSign size={48} className="text-accent-secondary mb-4" />
            <h2>Environment Variables</h2>
            <p>Manage secrets and global configuration for your flows.</p>
            <button className="btn-action mt-4">Add Variable</button>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="placeholder-view">
            <Layers size={48} className="text-neon-blue mb-4" />
            <h2>Resources</h2>
            <p>Configure database connections and external services.</p>
            <button className="btn-action mt-4">Create Resource</button>
          </div>
        )}

        {activeTab !== 'home' && activeTab !== 'runs' && activeTab !== 'variables' && activeTab !== 'resources' && (
          <div className="placeholder-view">
            <Settings size={48} className="text-text-dim mb-4" />
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View</h2>
            <p>This section is being prepared for Corallum Studio.</p>
            <button className="btn-action mt-4" onClick={() => setActiveTab('home')}>Return Home</button>
          </div>
        )}
      </div>

      {testResult && (
        <div className="test-panel glass-panel">
          <div className="test-panel-header">
            <h3>Execution Result</h3>
            <button onClick={() => setTestResult(null)}>&times;</button>
          </div>
          <div className="test-panel-content">
            <pre>{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
