import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Info, 
  Calendar, 
  ArrowRightLeft,
  Link,
  Zap,
  Database,
  Radio,
  Wifi,
  Mail,
  Cloud
} from 'lucide-react';

interface SchedulesViewProps {
  searchQuery?: string;
}

export const SchedulesView: React.FC<SchedulesViewProps> = ({ searchQuery: externalSearch }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [pathFilter, setPathFilter] = useState<'schedule' | 'script-flow'>('schedule');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [onlyF, setOnlyF] = useState(false);
  const [showNewScheduleMenu, setShowNewScheduleMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const query = externalSearch || localSearch;

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

  const handleNewSchedule = () => {
    alert('New schedule functionality coming soon!');
  };

  // Position menu relative to button
  useEffect(() => {
    if (showNewScheduleMenu && buttonRef.current && menuRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      menuRef.current.style.top = `${buttonRect.bottom + 8}px`;
      menuRef.current.style.right = `${window.innerWidth - buttonRect.right}px`;
    }
  }, [showNewScheduleMenu]);

  return (
    <div className="schedules-view">
      <div className="schedules-header">
        <div className="schedules-title-section">
          <h1>Schedules</h1>
          <button className="info-icon-btn" title="Information">
            <Info size={16} />
          </button>
        </div>
        
        <div 
          ref={buttonRef}
          className="new-schedule-wrapper"
          onMouseEnter={() => setShowNewScheduleMenu(true)}
          onMouseLeave={() => setShowNewScheduleMenu(false)}
        >
          <button className="btn-action primary">
            <Plus size={16} />
            <span>New schedule</span>
          </button>
          {showNewScheduleMenu && (
            <div 
              ref={menuRef}
              className="new-schedule-menu glass-panel"
              onMouseEnter={() => setShowNewScheduleMenu(true)}
              onMouseLeave={() => setShowNewScheduleMenu(false)}
            >
              {triggerMenuItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="new-schedule-menu-item"
                    onClick={() => {
                      alert(`Create ${item.label} schedule`);
                      setShowNewScheduleMenu(false);
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

      <div className="schedules-filters">
        <div className="schedules-search-bar glass-panel">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search schedule"
            value={query}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="schedules-filter-section">
          <div className="path-filter-group">
            <span className="filter-label">Filter by path of</span>
            <div className="path-filter-buttons">
              <button
                className={`path-filter-btn ${pathFilter === 'schedule' ? 'active' : ''}`}
                onClick={() => setPathFilter('schedule')}
              >
                <Calendar size={14} />
                <span>Schedule</span>
              </button>
              <button
                className={`path-filter-btn ${pathFilter === 'script-flow' ? 'active' : ''}`}
                onClick={() => setPathFilter('script-flow')}
              >
                <ArrowRightLeft size={14} />
                <span>Script/Flow</span>
              </button>
            </div>
          </div>

          <div className="status-filter-group">
            <button
              className={`status-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`status-filter-btn ${statusFilter === 'enabled' ? 'active' : ''}`}
              onClick={() => setStatusFilter('enabled')}
            >
              Enabled
            </button>
            <button
              className={`status-filter-btn ${statusFilter === 'disabled' ? 'active' : ''}`}
              onClick={() => setStatusFilter('disabled')}
            >
              Disabled
            </button>
          </div>

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
      </div>

      <div className="schedules-content">
        <div className="empty-schedules-state">
          <p className="empty-title">No schedules</p>
        </div>
      </div>
    </div>
  );
};

