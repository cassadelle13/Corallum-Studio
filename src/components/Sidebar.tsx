import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  GitBranch, 
  Repeat, 
  Code, 
  Database,
  AlertCircle,
  Clock,
  CheckCircle,
  Zap,
  Globe,
  Mail,
  MessageSquare,
  FileText,
  Server,
  Webhook,
  Calendar,
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  RotateCw,
  Bot,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { useFlowStore } from '../store/flowStore';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NodeType {
  type: string;
  icon: any;
  label: string;
  description: string;
}

interface NodeCategory {
  name: string;
  icon: any;
  nodes: NodeType[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { addNode } = useFlowStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Triggers', 'Operators', 'Integrations', 'AI Agents'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  const categories: NodeCategory[] = [
    {
      name: 'Triggers',
      icon: Zap,
      nodes: [
        { type: 'start', icon: Play, label: 'Start', description: 'Initial workflow entry point' },
        { type: 'trigger', icon: Zap, label: 'Trigger', description: 'Start workflow on event' },
        { type: 'webhook', icon: Webhook, label: 'Webhook', description: 'Receive HTTP requests' },
        { type: 'schedule', icon: Calendar, label: 'Schedule', description: 'Run at specific times' },
      ]
    },
    {
      name: 'Operators',
      icon: GitBranch,
      nodes: [
        { type: 'logic', icon: GitBranch, label: 'Logic', description: 'Conditional branching' },
        { type: 'loop', icon: Repeat, label: 'Loop', description: 'Iterate over items' },
        { type: 'transform', icon: RotateCw, label: 'Transform', description: 'Modify data structure' },
        { type: 'code', icon: Code, label: 'Code', description: 'Custom Python/JS code' },
      ]
    },
    {
      name: 'Integrations',
      icon: Globe,
      nodes: [
        { type: 'http', icon: Globe, label: 'HTTP Request', description: 'Call external APIs' },
        { type: 'database', icon: Database, label: 'Database', description: 'Query SQL/NoSQL' },
        { type: 'email', icon: Mail, label: 'Email', description: 'Send notifications' },
        { type: 'slack', icon: MessageSquare, label: 'Slack', description: 'Post to channels' },
      ]
    },
    {
      name: 'AI Agents',
      icon: Bot,
      nodes: [
        { type: 'llm', icon: Bot, label: 'LLM Prompt', description: 'Generate text with AI' },
        { type: 'vision', icon: Bot, label: 'Vision', description: 'Analyze images' },
        { type: 'agent', icon: Bot, label: 'Autonomous Agent', description: 'Complex task solver' },
      ]
    }
  ];

  const toggleCategory = (name: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    nodes: cat.nodes.filter(node => 
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.nodes.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="sidebar"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="sidebar-header">
        <div className="sidebar-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Component Library</h3>
          <button onClick={onToggle} className="close-btn" style={{ padding: '4px' }}>
            <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
        <p className="sidebar-subtitle">Drag or tap to add to canvas</p>
        
        <div className="sidebar-search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search components..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-content">
        {filteredCategories.map(category => (
          <div key={category.name} className="sidebar-category">
            <div 
              className="category-header"
              onClick={() => toggleCategory(category.name)}
            >
              <div className="category-title">
                <category.icon size={16} />
                <span>{category.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="category-count">{category.nodes.length}</span>
                {expandedCategories.has(category.name) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
            </div>
            
            {expandedCategories.has(category.name) && (
              <div className="category-nodes">
                {category.nodes.map(nodeType => (
                  <div 
                    key={nodeType.label}
                    className="sidebar-item"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/reactflow', nodeType.type);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={() => addNode(nodeType.type)}
                  >
                    <div className="sidebar-item-icon">
                      <nodeType.icon size={18} />
                    </div>
                    <div className="sidebar-item-content">
                      <div className="sidebar-item-label">{nodeType.label}</div>
                      <div className="sidebar-item-description">{nodeType.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-btn">
          <Globe size={16} />
          Import from Hub
        </button>
      </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
