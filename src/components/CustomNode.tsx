import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, Code, Database, Globe, MessageSquare, Play, GitBranch, Clock } from 'lucide-react';

const getIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('webhook')) return <Zap size={16} className="text-neon-blue" />;
  if (l.includes('script')) return <Code size={16} className="text-accent-primary" />;
  if (l.includes('database')) return <Database size={16} className="text-accent-secondary" />;
  if (l.includes('http')) return <Globe size={16} className="text-neon-blue" />;
  if (l.includes('slack')) return <MessageSquare size={16} className="text-neon-pink" />;
  if (l.includes('branch')) return <GitBranch size={16} className="text-accent-primary" />;
  if (l.includes('delay')) return <Clock size={16} className="text-text-dim" />;
  return <Play size={16} className="text-accent-primary" />;
};

export const CustomNode = memo(({ data }: any) => {
  return (
    <div className="futuristic-node">
      <Handle type="target" position={Position.Top} className="handle-neon" />
      
      <div className="node-header">
        {getIcon(data.label || '')}
        <span>{data.label}</span>
      </div>
      
      <div className="node-body">
        <div className="node-code-preview">
          {data.language === 'sql' ? 'SELECT * FROM...' : 'def main():...'}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="handle-neon" />
    </div>
  );
});
