import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Zap, Code, Database, Globe, MessageSquare, Play, GitBranch, Clock, 
  CheckCircle, Calendar, Repeat, CheckCircle2, AlertCircle, Mail, FileText, Server,
  Webhook, Menu, RotateCw, Bot, ArrowRight, ArrowDownRight
} from 'lucide-react';

// Определение категорий и их цветов
const getCategoryFromType = (type: string): string => {
  const triggers = ['webhook', 'schedule', 'manual', 'trigger'];
  const operators = ['action', 'branch', 'loop', 'script', 'approval', 'delay', 'error', 'flow', 'forloop', 'whileloop', 'branchtoone', 'branchtoall'];
  const integrations = ['http', 'database', 'slack', 'email', 'file', 'api'];
  const resources = ['model', 'memory', 'embedding'];
  const aiagents = ['aiagent'];
  
  if (triggers.includes(type)) return 'trigger';
  if (operators.includes(type)) return 'operator';
  if (integrations.includes(type)) return 'integration';
  if (resources.includes(type)) return 'resource';
  if (aiagents.includes(type)) return 'aiagent';
  return 'default';
};

// Цвета для категорий (неоновые обводки с градиентами)
const categoryColors: Record<string, { border: string; glow: string; bg: string; gradient: string }> = {
  trigger: {
    border: '#f97316', // оранжевый
    glow: 'rgba(249, 115, 22, 0.15)',
    bg: 'rgba(249, 115, 22, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(251, 146, 60, 0.2) 100%)'
  },
  operator: {
    border: '#6366f1', // индиго
    glow: 'rgba(99, 102, 241, 0.15)',
    bg: 'rgba(99, 102, 241, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)'
  },
  integration: {
    border: '#3b82f6', // синий
    glow: 'rgba(59, 130, 246, 0.15)',
    bg: 'rgba(59, 130, 246, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(96, 165, 250, 0.2) 100%)'
  },
  resource: {
    border: '#64748b', // серый
    glow: 'rgba(100, 116, 139, 0.12)',
    bg: 'rgba(100, 116, 139, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(100, 116, 139, 0.2) 0%, rgba(148, 163, 184, 0.15) 100%)'
  },
  aiagent: {
    border: '#8b5cf6', // фиолетовый
    glow: 'rgba(139, 92, 246, 0.15)',
    bg: 'rgba(139, 92, 246, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)'
  },
  default: {
    border: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.15)',
    bg: 'rgba(99, 102, 241, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)'
  }
};

// Определение формы узла
const getNodeShape = (type: string): 'square' | 'rectangle' | 'diamond' | 'circle' => {
  if (!type) return 'square';
  const normalizedType = type.toLowerCase().trim();
  // Прямоугольные узлы (только для AI Agent)
  if (normalizedType === 'aiagent' || normalizedType.includes('ai agent')) return 'rectangle';
  // Ромбовидные узлы (Branch/IF)
  if (normalizedType === 'branch' || normalizedType.includes('branch')) return 'diamond';
  // Круглые узлы (Resources: модели, память, embeddings)
  if (['model', 'memory', 'embedding', 'chatmodel', 'chat model', 'openai', 'postgres', 'pinecone'].includes(normalizedType)) return 'circle';
  // Квадратные узлы (по умолчанию для всех остальных)
  return 'square';
};

const getIcon = (type: string, label: string) => {
  const l = label.toLowerCase();
  const t = type.toLowerCase();
  
  if (t === 'aiagent' || l.includes('ai agent')) return <Bot size={16} />;
  if (t === 'webhook' || l.includes('webhook')) return <Webhook size={16} />;
  if (t === 'schedule' || l.includes('schedule')) return <Calendar size={16} />;
  if (t === 'script' || l.includes('script')) return <Code size={16} />;
  if (t === 'database' || l.includes('database')) return <Database size={16} />;
  if (t === 'http' || l.includes('http')) return <Globe size={16} />;
  if (t === 'slack' || l.includes('slack')) return <MessageSquare size={16} />;
  if (t === 'branchtoone' || l.includes('branch to one')) return <ArrowRight size={16} />;
  if (t === 'branchtoall' || l.includes('branch to all')) return <ArrowDownRight size={16} />;
  if (t === 'branch' || l.includes('branch')) return <GitBranch size={16} />;
  if (t === 'forloop' || l.includes('for loop')) return <RotateCw size={16} />;
  if (t === 'whileloop' || l.includes('while loop')) return <RotateCw size={16} />;
  if (t === 'loop' || l.includes('loop')) return <Repeat size={16} />;
  if (t === 'flow' || l.includes('flow')) return <Menu size={16} />;
  if (t === 'delay' || l.includes('delay')) return <Clock size={16} />;
  if (t === 'approval' || l.includes('approval') || l.includes('prompt')) return <CheckCircle2 size={16} />;
  if (t === 'error' || l.includes('error')) return <AlertCircle size={16} />;
  if (t === 'email' || l.includes('email')) return <Mail size={16} />;
  if (t === 'file' || l.includes('file')) return <FileText size={16} />;
  if (t === 'api' || l.includes('api')) return <Server size={16} />;
  if (l.includes('trigger') || t === 'trigger' || t === 'manual') return <Zap size={16} />;
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
    '--node-gradient': colors.gradient,
    ...(shape === 'diamond' ? { width: '100px', height: '100px', minWidth: '100px', minHeight: '100px', maxWidth: '100px', maxHeight: '100px' } : {}),
    ...(shape === 'circle' ? { width: '80px', height: '80px', minWidth: '80px', minHeight: '80px', maxWidth: '80px', maxHeight: '80px' } : {}),
    ...(shape === 'square' ? { width: '100px', height: '100px', minWidth: '100px', minHeight: '100px', maxWidth: '100px', maxHeight: '100px' } : {}),
    ...(shape === 'rectangle' ? { width: '150px', height: 'auto', minWidth: '150px', minHeight: '100px' } : {}),
  } as React.CSSProperties;

  // Для ромбовидных узлов (branch) используем специальную разметку
  if (shape === 'diamond') {
    return (
      <div className={nodeClasses} style={nodeStyle}>
        <Handle type="target" position={Position.Left} className="handle-neon" />
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
        <Handle type="target" position={Position.Left} className="handle-neon" />
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
        <Handle type="source" position={Position.Right} className="handle-neon" />
      </div>
    );
  }

  // Прямоугольные узлы (AI Agent)
  if (shape === 'rectangle') {
    return (
      <div className={nodeClasses} style={nodeStyle}>
        <Handle type="target" position={Position.Left} className="handle-neon" />
        
        <div className="node-header">
          <div className="node-icon-wrapper">
            {getIcon(nodeType, data.label || '')}
          </div>
          <span className="node-label">{data.label || 'AI Agent'}</span>
        </div>
        
        <div className="node-body">
          <div className="node-code-preview">
            {data.language === 'sql' ? 'SELECT * FROM...' : 'def ai_agent():...'}
          </div>
        </div>

        {hasConnectedOutput && (
          <div className="node-success-check">
            <CheckCircle size={16} />
          </div>
        )}

        <Handle type="source" position={Position.Right} className="handle-neon" />
      </div>
    );
  }

  // Квадратные узлы (по умолчанию)
  return (
    <div className={nodeClasses} style={nodeStyle}>
      {/* Вход слева только для не-триггеров */}
      {category !== 'trigger' && (
        <Handle type="target" position={Position.Left} className="handle-neon" />
      )}
      
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

      {/* Выход справа для всех */}
      <Handle type="source" position={Position.Right} className="handle-neon" />
    </div>
  );
});
