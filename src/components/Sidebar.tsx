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
  ArrowRight,
  ArrowDownRight
} from 'lucide-react';
import { useFlowStore } from '../store/flowStore';

interface SidebarProps {
  isOpen: boolean;
  onCollapse: () => void;
}

interface NodeType {
  type: string;
  icon: any;
  label: string;
  description: string;
  boilerplate?: string;
}

interface NodeCategory {
  name: string;
  icon: any;
  nodes: NodeType[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCollapse }) => {
  const { addNode } = useFlowStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Triggers', 'Operators', 'Integrations', 'AI Agents'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const nodeCategories: NodeCategory[] = [
    {
      name: 'Triggers',
      icon: Zap,
      nodes: [
        { 
          type: 'trigger', 
          icon: Zap, 
          label: 'Trigger', 
          description: 'Event trigger',
          boilerplate: 'def trigger_handler():\n    # Handle trigger event\n    return {"triggered": True}'
        },
        { 
          type: 'webhook', 
          icon: Webhook, 
          label: 'Webhook', 
          description: 'HTTP trigger',
          boilerplate: 'def webhook_handler(request):\n    return {"status": "received"}'
        },
        { 
          type: 'schedule', 
          icon: Calendar, 
          label: 'Schedule', 
          description: 'Cron trigger',
          boilerplate: 'def scheduled_task():\n    # Runs on schedule\n    pass'
        },
        { 
          type: 'manual', 
          icon: Play, 
          label: 'Manual', 
          description: 'Manual start',
          boilerplate: 'def main():\n    return {"started": True}'
        },
      ]
    },
    {
      name: 'Operators',
      icon: GitBranch,
      nodes: [
        { 
          type: 'action', 
          icon: Code, 
          label: 'Action', 
          description: 'Run script',
          boilerplate: 'def action(input_data):\n    # Process data\n    return input_data'
        },
        { 
          type: 'flow', 
          icon: Menu, 
          label: 'Flow', 
          description: 'Workflow step',
          boilerplate: 'def flow_step(input_data):\n    # Execute flow step\n    return input_data'
        },
        { 
          type: 'approval', 
          icon: CheckCircle, 
          label: 'Approval/Prompt', 
          description: 'Manual gate',
          boilerplate: 'def approval_gate():\n    # Wait for approval\n    return {"approved": False}'
        },
        { 
          type: 'forloop', 
          icon: RotateCw, 
          label: 'For loop', 
          description: 'Iterate over items',
          boilerplate: 'def for_loop_handler(items):\n    results = []\n    for item in items:\n        results.append(process(item))\n    return results'
        },
        { 
          type: 'whileloop', 
          icon: RotateCw, 
          label: 'While loop', 
          description: 'Loop while condition',
          boilerplate: 'def while_loop_handler():\n    while condition:\n        # Process\n        pass\n    return {"completed": True}'
        },
        { 
          type: 'branchtoone', 
          icon: ArrowRight, 
          label: 'Branch to one', 
          description: 'Conditional branch',
          boilerplate: 'def branch_to_one(input_data):\n    if condition:\n        return "path1"\n    return "path2"'
        },
        { 
          type: 'branchtoall', 
          icon: ArrowDownRight, 
          label: 'Branch to all', 
          description: 'Split to all paths',
          boilerplate: 'def branch_to_all(input_data):\n    # Split to all paths\n    return [input_data, input_data]'
        },
        { 
          type: 'branch', 
          icon: GitBranch, 
          label: 'Branch', 
          description: 'Conditional',
          boilerplate: 'def branch_condition(input_data):\n    if input_data.get("value") > 0:\n        return "positive"\n    return "negative"'
        },
        { 
          type: 'script', 
          icon: Code, 
          label: 'Script', 
          description: 'Code block',
          boilerplate: 'def script():\n    # Your custom logic\n    return {}'
        },
        { 
          type: 'delay', 
          icon: Clock, 
          label: 'Delay', 
          description: 'Wait time',
          boilerplate: 'import time\ndef delay(seconds=60):\n    time.sleep(seconds)\n    return {"delayed": seconds}'
        },
        { 
          type: 'error', 
          icon: AlertCircle, 
          label: 'Error Handler', 
          description: 'Catch errors',
          boilerplate: 'def error_handler(error):\n    # Handle error\n    return {"error": str(error)}'
        },
      ]
    },
    {
      name: 'Integrations',
      icon: Globe,
      nodes: [
        { 
          type: 'http', 
          icon: Globe, 
          label: 'HTTP Request', 
          description: 'API call',
          boilerplate: 'import requests\ndef http_request(url, method="GET"):\n    response = requests.request(method, url)\n    return response.json()'
        },
        { 
          type: 'database', 
          icon: Database, 
          label: 'Database', 
          description: 'SQL query',
          boilerplate: 'SELECT * FROM users WHERE status = \'active\' LIMIT 100;'
        },
        { 
          type: 'slack', 
          icon: MessageSquare, 
          label: 'Slack', 
          description: 'Send message',
          boilerplate: 'def send_slack_message(channel, text):\n    # Send to Slack\n    return {"sent": True}'
        },
        { 
          type: 'email', 
          icon: Mail, 
          label: 'Email', 
          description: 'Send email',
          boilerplate: 'def send_email(to, subject, body):\n    # Send email\n    return {"sent": True}'
        },
        { 
          type: 'file', 
          icon: FileText, 
          label: 'File Storage', 
          description: 'S3/Storage',
          boilerplate: 'def upload_file(file_path, bucket):\n    # Upload to S3\n    return {"uploaded": True}'
        },
        { 
          type: 'api', 
          icon: Server, 
          label: 'REST API', 
          description: 'External API',
          boilerplate: 'import requests\ndef call_api(endpoint, data):\n    response = requests.post(endpoint, json=data)\n    return response.json()'
        },
      ]
    },
    {
      name: 'AI Agents',
      icon: Bot,
      nodes: [
        { 
          type: 'aiagent', 
          icon: Bot, 
          label: 'AI Agent', 
          description: 'AI agent workflow',
          boilerplate: 'def ai_agent(input_data):\n    # AI agent processing\n    return {"result": "processed"}'
        },
      ]
    }
  ];

  const handleAddNode = (nodeType: NodeType) => {
    addNode(nodeType.type, nodeType.boilerplate);
  };

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node =>
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="sidebar"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="sidebar-header">
        <div className="sidebar-title">
          <h3>Component Library</h3>
        </div>
        <p className="sidebar-subtitle">Drag or tap to add to canvas</p>
        
        <div className="sidebar-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="sidebar-content">
        {filteredCategories.map((category) => {
          const CategoryIcon = category.icon;
          const isExpanded = expandedCategories.has(category.name);
          
          return (
            <div key={category.name} className="sidebar-category">
              <div 
                className="category-header"
                onClick={() => toggleCategory(category.name)}
              >
                <div className="category-title">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <CategoryIcon size={16} />
                  <span>{category.name}</span>
                </div>
                <span className="category-count">{category.nodes.length}</span>
              </div>
              
              {isExpanded && (
                <div className="category-nodes">
                  {category.nodes.map((nodeType) => {
                    const Icon = nodeType.icon;
                    return (
                      <div
                        key={nodeType.type}
                        className="sidebar-item"
                        onClick={() => handleAddNode(nodeType)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/reactflow', nodeType.type);
                          if (nodeType.boilerplate) {
                            e.dataTransfer.setData('application/boilerplate', nodeType.boilerplate);
                          }
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                      >
                        <div className="sidebar-item-icon">
                          <Icon size={20} />
                        </div>
                        <div className="sidebar-item-content">
                          <div className="sidebar-item-label">{nodeType.label}</div>
                          <div className="sidebar-item-description">{nodeType.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-btn">
          <Globe size={16} />
          Import from Hub
        </button>
      </div>
      <div className="sidebar-toggle-footer">
        <button onClick={onCollapse} className="sidebar-toggle-btn">
          <Menu size={20} />
          <span>Collapse Sidebar</span>
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
