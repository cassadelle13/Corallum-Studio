import React, { useState } from 'react';
import { Cpu, Tag, BarChart3, Plus, Info, Search, Eye, Settings } from 'lucide-react';

interface WorkersViewProps {
  searchQuery?: string;
}

export const WorkersView: React.FC<WorkersViewProps> = () => {
  const [activeGroup, setActiveGroup] = useState('default');
  const [localSearch, setLocalSearch] = useState('');

  const workerGroups = [
    { id: 'default', label: 'default 1 worker', count: 1 },
    { id: 'reports', label: 'reports 0 workers', count: 0 },
    { id: 'native', label: 'native 0 workers', count: 0 },
  ];

  const tags = ['deno', 'python3', 'go', 'bash', 'powershell', 'dependency', 'flow', 'hub', 'other', 'bun', 'php', 'rust', 'ansible', 'csharp', 'nu', 'java', 'duckdb', 'ruby'];

  const workers = [
    {
      id: 'wk-default-polyakova-aZvbO',
      host: 'polyakova',
      ip: '193.36.132.87',
      startTime: '29.12, 08:27',
      jobsRan: 0,
      lastJob: '',
      occupancy: [20, 15, 10, 5],
      memory: { total: '746MB', windmill: '267MB' },
      limits: '--',
      version: 'v1.601.1',
      status: 'Alive 9s ago',
      isAlive: true,
    },
  ];

  return (
    <div className="workers-view">
      <div className="view-header">
        <div className="header-title">
          <Cpu size={20} />
          <h1>Workers</h1>
          <Info size={16} />
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Tag size={16} />
            <span>Manage tags</span>
          </button>
          <button className="btn-secondary">
            <BarChart3 size={16} />
            <span>Queue metrics</span>
          </button>
          <button className="btn-action primary">
            <Plus size={16} />
            <span>New agent worker</span>
          </button>
          <button className="btn-action">
            <Plus size={16} />
            <span>New group config (EE)</span>
            <Info size={12} />
          </button>
        </div>
      </div>

      <div className="workers-content">
        <div className="worker-group-tabs">
          {workerGroups.map(group => (
            <button
              key={group.id}
              className={`group-tab ${activeGroup === group.id ? 'active' : ''}`}
              onClick={() => setActiveGroup(group.id)}
            >
              {group.label}
            </button>
          ))}
        </div>

        {activeGroup === 'default' && (
          <div className="worker-group-details">
            <div className="group-header">
              <div>
                <h3>Worker group: default - 1 worker</h3>
                <Info size={14} />
              </div>
              <button className="btn-secondary">
                <Settings size={14} />
                <span>See config</span>
              </button>
            </div>

            <div className="worker-tags">
              {tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <div className="active-workers-section">
              <h4>Active workers</h4>
              <div className="search-bar glass-panel">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search workers in group 'default'"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
              </div>

              <div className="workers-table">
                <table>
                  <thead>
                    <tr>
                      <th><div>Worker</div></th>
                      <th><div>Worker start</div></th>
                      <th><div>Jobs ran</div></th>
                      <th><div>Last job</div></th>
                      <th><div>Occupancy rate (15s/5m/30m/ever)</div></th>
                      <th><div>Memory usage (Windmill)</div></th>
                      <th><div>Limits</div></th>
                      <th><div>Version</div></th>
                      <th><div>Status</div></th>
                      <th>
                        <div>Repl <Info size={12} /></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map(worker => (
                      <tr key={worker.id}>
                        <td>
                          <div className="worker-info">
                            <div className="worker-host">{worker.host}</div>
                            <div className="worker-ip">{worker.ip}</div>
                            <div className="worker-id">{worker.id}</div>
                          </div>
                        </td>
                        <td>{worker.startTime}</td>
                        <td>{worker.jobsRan}</td>
                        <td>{worker.lastJob || '—'}</td>
                        <td>
                          <div className="occupancy-bars">
                            {worker.occupancy.map((value, idx) => (
                              <div key={idx} className="occupancy-bar" style={{ width: `${value}%` }} />
                            ))}
                          </div>
                        </td>
                        <td>
                          <div>{worker.memory.total}</div>
                          <div className="memory-detail">({worker.memory.windmill})</div>
                        </td>
                        <td>{worker.limits}</td>
                        <td>{worker.version}</td>
                        <td>
                          <span className={`status-badge ${worker.isAlive ? 'alive' : ''}`}>
                            {worker.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-repl">
                            <span>&gt;_</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="autoscaling-section">
              <h4>Autoscaling events</h4>
              <p className="info-text">Autoscaling is an EE feature</p>
            </div>
          </div>
        )}

        {activeGroup !== 'default' && (
          <div className="empty-state">
            <Cpu size={48} />
            <p><strong>No workers in this group</strong></p>
            <p>Add workers to this group to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

