import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Zap, Code, Database, Globe, MessageSquare, Play, GitBranch, Clock, 
  CheckCircle, Calendar, Repeat, CheckCircle2, AlertCircle, Mail, FileText, Server,
  Webhook
} from 'lucide-react';

// Определение категорий и их цветов
const getCategoryFromType = (type: string): string => {
  const triggers = ['webhook', 'schedule', 'manual'];
  const operators = ['action', 'branch', 'loop', 'script', 'approval', 'delay', 'error'];
  const integrations = ['http', 'database', 'slack', 'email', 'file', 'api'];
  const resources = ['model', 'memory', 'embedding'];
  
  if (triggers.includes(type)) return 'trigger';
  if (operators.includes(type)) return 'operator';
  if (integrations.includes(type)) return 'integration';
  if (resources.includes(type)) return 'resource';
  return 'default';
};

// Цвета для категорий (неоновые обводки)
const categoryColors: Record<string, { border: string; glow: string; bg: string }> = {
  trigger: {
    border: '#10b981', // зеленый
    glow: 'rgba(16, 185, 129, 0.4)',
    bg: 'rgba(16, 185, 129, 0.1)'
  },
  operator: {
    border: '#6366f1', // индиго
    glow: 'rgba(99, 102, 241, 0.4)',
    bg: 'rgba(99, 102, 241, 0.1)'
  },
  integration: {
    border: '#3b82f6', // синий
    glow: 'rgba(59, 130, 246, 0.4)',
    bg: 'rgba(59, 130, 246, 0.1)'
  },
  resource: {
    border: '#64748b', // серый
    glow: 'rgba(100, 116, 139, 0.3)',
    bg: 'rgba(100, 116, 139, 0.1)'
  },
  default: {
    border: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.4)',
    bg: 'rgba(99, 102, 241, 0.1)'
  }
};

// Определение формы узла
const getNodeShape = (type: string): 'rectangle' | 'diamond' | 'circle' => {
  if (type === 'branch') return 'diamond';
  if (['model', 'memory', 'embedding'].includes(type)) return 'circle';
  return 'rectangle';
};

const getIcon = (type: string, label: string) => {
  const l = label.toLowerCase();
  const t = type.toLowerCase();
  
  if (t === 'webhook' || l.includes('webhook')) return <Webhook size={16} />;
  if (t === 'schedule' || l.includes('schedule')) return <Calendar size={16} />;
  if (t === 'script' || l.includes('script')) return <Code size={16} />;
  if (t === 'database' || l.includes('database')) return <Database size={16} />;
  if (t === 'http' || l.includes('http')) return <Globe size={16} />;
  if (t === 'slack' || l.includes('slack')) return <MessageSquare size={16} />;
  if (t === 'branch' || l.includes('branch')) return <GitBranch size={16} />;
  if (t === 'loop' || l.includes('loop')) return <Repeat size={16} />;
  if (t === 'delay' || l.includes('delay')) return <Clock size={16} />;
  if (t === 'approval' || l.includes('approval')) return <CheckCircle2 size={16} />;
  if (t === 'error' || l.includes('error')) return <AlertCircle size={16} />;
  if (t === 'email' || l.includes('email')) return <Mail size={16} />;
  if (t === 'file' || l.includes('file')) return <FileText size={16} />;
  if (t === 'api' || l.includes('api')) return <Server size={16} />;
  if (l.includes('trigger') || t === 'manual') return <Zap size={16} />;
  return <Play size={16} />;
};

export const CustomNode = memo(({ data, selected }: any) => {
  const nodeType = data.type || 'default';
  const category = getCategoryFromType(nodeType);
  const shape = getNodeShape(nodeType);
  const colors = categoryColors[category];
  const isConnected = data.isConnected || false; // Флаг успешного подключения
  const hasOutput = data.hasOutput || false; // Флаг наличия выхода
  
  // Определяем, есть ли подключенные выходы
  const hasConnectedOutput = isConnected || hasOutput;

  const nodeClasses = [
    'futuristic-node',
    `node-${shape}`,
    `node-category-${category}`,
    selected ? 'node-selected' : '',
    hasConnectedOutput ? 'node-connected' : ''
  ].filter(Boolean).join(' ');

  const nodeStyle = {
    '--node-border-color': colors.border,
    '--node-glow-color': colors.glow,
    '--node-bg-color': colors.bg,
  } as React.CSSProperties;

  // Для ромбовидных узлов (branch) используем специальную разметку
  if (shape === 'diamond') {
    return (
      <div className={nodeClasses} style={nodeStyle}>
        <Handle type="target" position={Position.Top} className="handle-neon" />
        <div className="node-diamond-content">
          <div className="node-diamond-icon">
            {getIcon(nodeType, data.label || '')}
          </div>
          <div className="node-diamond-label">{data.label || 'Branch'}</div>
          {hasConnectedOutput && (
            <div className="node-success-check">
              <CheckCircle size={14} />
            </div>
          )}
        </div>
        <Handle type="source" position={Position.Right} id="true" className="handle-neon" />
        <Handle type="source" position={Position.Bottom} id="false" className="handle-neon" />
      </div>
    );
  }

  // Для круглых узлов (ресурсы)
  if (shape === 'circle') {
    return (
      <div className={nodeClasses} style={nodeStyle}>
        <Handle type="target" position={Position.Top} className="handle-neon" />
        <div className="node-circle-content">
          <div className="node-circle-icon">
            {getIcon(nodeType, data.label || '')}
          </div>
          <div className="node-circle-label">{data.label || 'Resource'}</div>
          {hasConnectedOutput && (
            <div className="node-success-check">
              <CheckCircle size={14} />
            </div>
          )}
        </div>
        <Handle type="source" position={Position.Bottom} className="handle-neon" />
      </div>
    );
  }

  // Прямоугольные узлы (по умолчанию)
  return (
    <div className={nodeClasses} style={nodeStyle}>
      <Handle type="target" position={Position.Top} className="handle-neon" />
      
      {/* Иконка триггера (молния) для триггеров */}
      {category === 'trigger' && (
        <div className="node-trigger-icon">
          <Zap size={12} />
        </div>
      )}
      
      <div className="node-header">
        <div className="node-icon-wrapper">
          {getIcon(nodeType, data.label || '')}
        </div>
        <span className="node-label">{data.label || 'Node'}</span>
      </div>
      
      <div className="node-body">
        <div className="node-code-preview">
          {data.language === 'sql' ? 'SELECT * FROM...' : 'def main():...'}
        </div>
      </div>

      {/* Галочка успешного подключения */}
      {hasConnectedOutput && (
        <div className="node-success-check">
          <CheckCircle size={16} />
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="handle-neon" />
    </div>
  );
});
