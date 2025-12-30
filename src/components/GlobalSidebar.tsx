import React, { useState } from 'react';
import { 
  Home, 
  PlayCircle, 
  DollarSign, 
  Layers, 
  Package, 
  BookOpen, 
  Calendar, 
  User, 
  Settings, 
  Cpu, 
  Folder, 
  List,
  Search,
  MessageSquare,
  Plus,
  Link,
  Zap,
  Database,
  Radio,
  Wifi,
  Mail,
  Cloud
} from 'lucide-react';

interface GlobalSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearch: (query: string) => void;
  isCollapsed?: boolean;
}

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ activeTab, setActiveTab, onSearch, isCollapsed }) => {
  const [showTriggerMenu, setShowTriggerMenu] = useState(false);

  const mainNav = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'runs', icon: PlayCircle, label: 'Runs' },
    { id: 'variables', icon: DollarSign, label: 'Variables' },
    { id: 'resources', icon: Layers, label: 'Resources' },
    { id: 'assets', icon: Package, label: 'Assets' },
    { id: 'tutorials', icon: BookOpen, label: 'Tutorials' },
  ];

  const triggersNav = [
    { id: 'schedules', icon: Calendar, label: 'Schedules' },
  ];

  const triggerMenuItems = [
    { id: 'http', icon: Link, label: 'HTTP' },
    { id: 'websockets', icon: Zap, label: 'WebSockets' },
    { id: 'postgres', icon: Database, label: 'Postgres' },
    { id: 'kafka', icon: Radio, label: 'Kafka (EE)' },
    { id: 'nats', icon: Radio, label: 'NATS (EE)' },
    { id: 'aws-sqs', icon: Cloud, label: 'AWS SQS (EE)' },
    { id: 'gcp-pubsub', icon: Cloud, label: 'GCP Pub/Sub (EE)' },
    { id: 'mqtt', icon: Wifi, label: 'MQTT' },
    { id: 'email', icon: Mail, label: 'Email' },
  ];

  const bottomNav = [
    { id: 'user', icon: User, label: 'User (admin@...)' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'workers', icon: Cpu, label: 'Workers' },
    { id: 'folders', icon: Folder, label: 'Folders & Group...' },
    { id: 'logs', icon: List, label: 'Logs' },
  ];

  return (
    <div className={`global-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <img src="/assets/logo.png" alt="Corallum Logo" className="brand-logo-img" />
        <span>Corallum</span>
      </div>

      <div className="sidebar-search-trigger">
        <div className="search-item">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            className="sidebar-search-input"
            onChange={(e) => onSearch(e.target.value)}
          />
          <span className="shortcut">Ctrl+k</span>
        </div>
        <div className="search-item">
          <MessageSquare size={16} />
          <span>Ask AI</span>
          <span className="shortcut">Ctrl+L</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {mainNav.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <div className="section-label">TRIGGERS</div>
          {triggersNav.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
          <div 
            className="add-trigger-wrapper"
            onMouseEnter={() => setShowTriggerMenu(true)}
            onMouseLeave={() => setShowTriggerMenu(false)}
          >
            <button className="nav-item add-trigger">
              <Plus size={18} />
            </button>
            {showTriggerMenu && (
              <div className="trigger-menu glass-panel">
                {triggerMenuItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className="trigger-menu-item"
                      onClick={() => {
                        alert(`Create ${item.label} trigger`);
                        setShowTriggerMenu(false);
                      }}
                    >
                      <ItemIcon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="sidebar-footer-nav">
        {bottomNav.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
