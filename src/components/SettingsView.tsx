import React, { useState } from 'react';
import { Settings, Users, GitBranch, Rocket, MessageSquare, Webhook, Bot, Database, Folder, Lock, Globe, Package, Info, Plus } from 'lucide-react';

interface SettingsViewProps {
  searchQuery?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = () => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'git', label: 'Git Sync', icon: GitBranch },
    { id: 'deployment', label: 'Deployment UI', icon: Rocket },
    { id: 'slack', label: 'Slack / Teams', icon: MessageSquare },
    { id: 'webhook', label: 'Webhook', icon: Webhook },
    { id: 'error', label: 'Error Handler', icon: Settings },
    { id: 'ai', label: 'Windmill AI', icon: Bot },
    { id: 'tables', label: 'Data Tables', icon: Database },
    { id: 'storage', label: 'Object Storage (S3)', icon: Folder },
    { id: 'app', label: 'Default App', icon: Globe },
    { id: 'encryption', label: 'Encryption', icon: Lock },
    { id: 'general', label: 'General', icon: Settings },
    { id: 'dependencies', label: 'Dependencies', icon: Package },
  ];

  const ActiveTabIcon = tabs.find(t => t.id === activeTab)?.icon || Settings;

  return (
    <div className="settings-view">
      <div className="view-header">
        <div className="header-title">
          <Settings size={20} />
          <h1>Workspace settings: admins</h1>
        </div>
        <button className="btn-secondary">
          Instance settings
        </button>
      </div>

      <div className="settings-tabs">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="settings-content">
        {activeTab === 'users' && (
          <div className="settings-panel">
            <div className="panel-description">
              Add members to your workspace and manage their roles. You can also auto-add users to join your workspace. <a href="#" className="link">Learn more</a>.
            </div>

            <div className="settings-section">
              <div className="section-header">
                <h3>Members (1)</h3>
                <Info size={14} />
              </div>

              <div className="section-controls">
                <div className="search-bar glass-panel">
                  <input type="text" placeholder="Q Filter members" />
                </div>
                <button className="toggle-btn">
                  <Users size={14} />
                  <span>Auto-add: OFF</span>
                </button>
                <button className="btn-action primary">
                  <Plus size={16} />
                  <span>Add new user</span>
                </button>
              </div>

              <div className="members-table">
                <table>
                  <thead>
                    <tr>
                      <th><div>Email</div></th>
                      <th><div>Username</div></th>
                      <th>
                        <div>Executions (1w) <Info size={12} /></div>
                      </th>
                      <th><div>Status</div></th>
                      <th><div>Role</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>rusik13022000s@gmail.com</td>
                      <td>ruru</td>
                      <td>0</td>
                      <td>
                        <span className="status-badge active">Active</span>
                      </td>
                      <td>Admin</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="settings-section">
              <div className="section-header">
                <h3>Operator settings</h3>
                <Info size={14} />
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'users' && (
          <div className="settings-panel">
            <div className="empty-state">
              <ActiveTabIcon size={48} />
              <p><strong>{tabs.find(t => t.id === activeTab)?.label} settings</strong></p>
              <p>Configuration options for this section will be available soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

