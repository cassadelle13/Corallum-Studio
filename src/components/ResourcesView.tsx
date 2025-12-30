import React, { useState } from 'react';
import { Plus, Search, RefreshCw, Info, Settings2 } from 'lucide-react';

interface ResourcesViewProps {
  searchQuery?: string;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ searchQuery: externalSearch }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('workspace');
  const [onlyF, setOnlyF] = useState(false);
  const query = externalSearch || localSearch;

  const tabs = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'resource-types', label: 'Resource Types' },
    { id: 'states', label: 'States' },
    { id: 'cache', label: 'Cache' },
    { id: 'theme', label: 'Theme' },
  ];

  const handleRefresh = () => {
    // Refresh resources logic
    console.log('Refreshing resources...');
  };

  const handleAddResourceType = () => {
    alert('Add resource type functionality coming soon!');
  };

  const handleAddResource = () => {
    alert('Add resource functionality coming soon!');
  };

  return (
    <div className="resources-view">
      <div className="resources-header">
        <div className="resources-title-section">
          <h1>Resources</h1>
          <button className="info-icon-btn" title="Information">
            <Info size={16} />
          </button>
        </div>
        
        <div className="resources-actions">
          <button className="btn-action secondary" onClick={handleAddResourceType}>
            <Plus size={16} />
            <span>Add resource type</span>
          </button>
          <button className="btn-action primary" onClick={handleAddResource}>
            <Settings2 size={16} />
            <span>Add resource</span>
          </button>
        </div>
      </div>

      <div className="resources-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`resource-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.id !== 'workspace' && (
              <button className="tab-info-icon" title="Information">
                <Info size={12} />
              </button>
            )}
          </button>
        ))}
      </div>

      <div className="resources-filters">
        <div className="resources-search-bar glass-panel">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search Resource"
            value={query}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        
        <button className="refresh-btn" onClick={handleRefresh} title="Refresh">
          <RefreshCw size={16} />
        </button>
        
        <div className="toggle-filter">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={onlyF}
              onChange={(e) => setOnlyF(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Only f/*</span>
        </div>
      </div>

      <div className="resources-content">
        <div className="empty-resources-state">
          <p className="empty-title"><strong>No resources found</strong></p>
          <p className="empty-description">
            Try changing the filters or creating a new resource
          </p>
        </div>
      </div>
    </div>
  );
};

