import React, { useState } from 'react';
import { User, Mail, Crown, Settings, Moon, Sun, LogOut, Info } from 'lucide-react';

interface UserViewProps {
  searchQuery?: string;
}

export const UserView: React.FC<UserViewProps> = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  return (
    <div className="user-view">
      <div className="view-header">
        <div className="header-title">
          <User size={20} />
          <h1>User Profile</h1>
        </div>
      </div>

      <div className="user-content">
        <div className="user-profile-card glass-panel">
          <div className="profile-header">
            <div className="profile-avatar">
              <User size={32} />
            </div>
            <div className="profile-info">
              <h2>admin@windmill.dev</h2>
              <div className="profile-role">
                <Crown size={14} />
                <span>Admin of this workspace</span>
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <Mail size={16} />
              <div>
                <div className="detail-label">Email</div>
                <div className="detail-value">admin@windmill.dev</div>
              </div>
            </div>
          </div>
        </div>

        <div className="user-settings-section glass-panel">
          <h3>Account Settings</h3>
          <div className="settings-list">
            <button className="settings-item">
              <Settings size={18} />
              <span>Account settings</span>
            </button>
            <button className="settings-item" onClick={() => setIsDarkTheme(!isDarkTheme)}>
              {isDarkTheme ? <Moon size={18} /> : <Sun size={18} />}
              <span>Switch theme</span>
            </button>
            <button className="settings-item danger">
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

