import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Edit2, MoreVertical, Code, GitBranch, Layout, ChevronDown, FileJson, FileCode } from 'lucide-react';

interface HomeViewProps {
  onCreateFlow: () => void;
  searchQuery: string;
}

export const HomeView: React.FC<HomeViewProps> = ({ onCreateFlow, searchQuery: externalSearch }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [showFlowDropdown, setShowFlowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const query = externalSearch || localSearch;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFlowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImportClick = (type: 'yaml' | 'json') => {
    setShowFlowDropdown(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'yaml' ? '.yaml,.yml' : '.json';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Importing ${file.name} from n8n...`);
      // Logic for parsing and importing would go here
    }
  };

  const items = [
    { id: 1, type: 'script', name: 'Synchronize Hub Resource types with instance', user: 'u/admin/hub_sync', icon: Code },
    { id: 2, type: 'app', name: 'New User Setup App', user: 'g/all/setup_app', icon: Layout },
    { id: 3, type: 'flow', name: 'Lead Generation Workflow', user: 'u/admin/leads', icon: GitBranch },
  ];

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.user.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="home-view">
      <div className="home-header">
        <div className="workspace-info glass-panel">
          <div className="info-icon">i</div>
          <div className="info-text">
            <strong>Admins workspace</strong>
            <p>The Admins workspace is for admins only and contains scripts whose purpose is to manage your Corallum instance, such as keeping resource types up to date.</p>
          </div>
        </div>
        
        <div className="home-title-row">
          <h1>Home</h1>
          <div className="action-buttons">
            <span>Create a</span>
            <button className="btn-action" onClick={() => alert('Script creation coming soon!')}>
              <Plus size={16} />
              <span>Script</span>
              <Code size={14} />
            </button>
            <div className="dropdown-container" ref={dropdownRef}>
              <div className="btn-group">
                <button className="btn-action primary" onClick={onCreateFlow}>
                  <Plus size={16} />
                  <span>Flow</span>
                  <GitBranch size={14} />
                </button>
                <button 
                  className="btn-action primary dropdown-toggle" 
                  onClick={() => setShowFlowDropdown(!showFlowDropdown)}
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              
              {showFlowDropdown && (
                <div className="dropdown-menu glass-panel">
                  <button className="dropdown-item" onClick={() => handleImportClick('yaml')}>
                    <FileCode size={14} />
                    <span>Import from YAML</span>
                  </button>
                  <button className="dropdown-item" onClick={() => handleImportClick('json')}>
                    <FileJson size={14} />
                    <span>Import from JSON</span>
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
            </div>
            <button className="btn-action" onClick={() => alert('App creation coming soon!')}>
              <Plus size={16} />
              <span>App</span>
              <Layout size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="home-content">
        <div className="content-tabs">
          <button className="tab active">Workspace</button>
          <button className="tab">Hub</button>
        </div>

        <div className="content-filters">
          <div className="filter-group">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Scripts</button>
            <button className="filter-btn">Flows</button>
            <button className="filter-btn">Apps</button>
          </div>
          
          <div className="search-bar glass-panel">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search Scripts, Flows & Apps" 
              value={query}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          
          <button className="content-btn">Content</button>
        </div>

        <div className="item-list">
          {filteredItems.map(item => (
            <div key={item.id} className="list-item glass-panel">
              <div className={`item-icon ${item.type}`}>
                <item.icon size={16} />
              </div>
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-meta">{item.user}</div>
              </div>
              <div className="item-actions">
                <button className="btn-icon" onClick={item.type === 'flow' ? onCreateFlow : undefined}>
                  <Edit2 size={16} /> <span>Edit</span>
                </button>
                <button className="btn-icon"><MoreVertical size={16} /></button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="empty-state">
              <p>No items found matching "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
