import React, { useState, useEffect } from 'react';
import { X, Code, Settings, Play, Database, Zap } from 'lucide-react';
import type { Node } from '@xyflow/react';
import { useFlowStore } from '../store/flowStore';
import Editor from '@monaco-editor/react';

interface NodeEditorProps {
  node: Node | null;
  onClose: () => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({ node, onClose }) => {
  const { updateNode, deleteNode, nodes } = useFlowStore();
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [activeTab, setActiveTab] = useState<'code' | 'inputs' | 'settings'>('code');

  useEffect(() => {
    if (node && node.data) {
      setLabel(String(node.data.label || ''));
      setCode(String(node.data.code || ''));
      setLanguage(String(node.data.language || 'python'));
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    updateNode(node.id, { label, code, language });
    onClose();
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  // Get available inputs from previous nodes
  const getPreviousNodes = () => {
    return nodes.filter(n => n.id !== node.id);
  };

  const getMonacoLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      'python': 'python',
      'typescript': 'typescript',
      'javascript': 'javascript',
      'sql': 'sql',
      'bash': 'shell',
      'go': 'go'
    };
    return languageMap[lang] || 'python';
  };

  const getBoilerplateCode = (lang: string) => {
    const boilerplates: Record<string, string> = {
      python: `def main(input_data):
    """
    Process input data and return result
    Args:
        input_data: Input from previous node
    Returns:
        dict: Processed result
    """
    # Your code here
    result = {
        "status": "success",
        "data": input_data
    }
    return result`,
      typescript: `interface Input {
  data: any;
}

interface Output {
  status: string;
  data: any;
}

export async function main(input: Input): Promise<Output> {
  // Your code here
  return {
    status: "success",
    data: input.data
  };
}`,
      sql: `-- Query data from database
SELECT 
    id,
    name,
    created_at
FROM 
    users
WHERE 
    status = 'active'
LIMIT 100;`
    };
    return boilerplates[lang] || '';
  };

  return (
    <div className="right-panel active">
      <div className="node-editor">
      <div className="node-editor-header">
        <div className="header-title">
          <Settings size={18} />
          <h3>Node: {label || 'Untitled'}</h3>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="node-editor-tabs">
        <button 
          className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          <Code size={16} />
          <span>Code</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'inputs' ? 'active' : ''}`}
          onClick={() => setActiveTab('inputs')}
        >
          <Database size={16} />
          <span>Inputs</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>

      <div className="node-editor-content">
        {activeTab === 'code' && (
          <div className="editor-tab-content">
            <div className="form-group">
              <label>Language</label>
              <select 
                value={language} 
                onChange={(e) => {
                  const newLang = e.target.value;
                  setLanguage(newLang);
                  if (!code) {
                    setCode(getBoilerplateCode(newLang));
                  }
                }}
                className="language-select"
              >
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
                <option value="go">Go</option>
              </select>
            </div>

            <div className="form-group monaco-container">
              <div className="label-with-icon">
                <Code size={14} />
                <label>Source Code</label>
                <button 
                  className="btn-boilerplate"
                  onClick={() => setCode(getBoilerplateCode(language))}
                >
                  <Zap size={12} />
                  Insert Boilerplate
                </button>
              </div>
              <div className="monaco-editor-wrapper">
                <Editor
                  height="400px"
                  language={getMonacoLanguage(language)}
                  value={code}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    padding: { top: 10, bottom: 10 }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inputs' && (
          <div className="editor-tab-content">
            <div className="inputs-section">
              <h4>Data Mapping</h4>
              <p className="section-description">
                Select outputs from previous nodes as inputs for this node
              </p>
              
              <div className="available-inputs">
                {getPreviousNodes().length > 0 ? (
                  getPreviousNodes().map(prevNode => (
                    <div key={prevNode.id} className="input-node-card">
                      <div className="input-node-header">
                        <Database size={16} />
                        <span>{String(prevNode.data.label || prevNode.id)}</span>
                      </div>
                      <div className="input-reference">
                        <code>{`{{nodes.${prevNode.id}.output}}`}</code>
                        <button 
                          className="btn-copy"
                          onClick={() => {
                            navigator.clipboard.writeText(`{{nodes.${prevNode.id}.output}}`);
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Database size={32} />
                    <p>No previous nodes available</p>
                    <span>Connect nodes to enable data mapping</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="editor-tab-content">
            <div className="form-group">
              <label>Node Name</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter node name..."
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe what this node does..."
                className="textarea-field"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Timeout (seconds)</label>
              <input
                type="number"
                placeholder="300"
                className="input-field"
                defaultValue={300}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Retry on failure</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="node-editor-footer">
        <button className="btn-delete" onClick={() => { deleteNode(node.id); onClose(); }}>
          Delete Node
        </button>
        <div className="footer-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            <Play size={14} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};
