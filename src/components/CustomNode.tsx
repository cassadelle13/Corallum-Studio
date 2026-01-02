import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Zap, Code, Database, Globe, MessageSquare, Play, GitBranch, Clock, 
  CheckCircle, Calendar, Repeat, CheckCircle2, AlertCircle, Mail, FileText, Server,
  Webhook, Menu, RotateCw, Bot, ArrowRight, ArrowDownRight
} from 'lucide-react';

// Определение категорий и их цветов
const getCategoryFromType = (type: string): string => {
  const triggers = ['webhook', 'schedule', 'manual', 'trigger', 'start'];
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
  
  const iconSize = 24;
  if (t === 'aiagent' || l.includes('ai agent')) return <Bot size={iconSize} />;
  if (t === 'webhook' || l.includes('webhook')) return <Webhook size={iconSize} />;
  if (t === 'schedule' || l.includes('schedule')) return <Calendar size={iconSize} />;
  if (t === 'script' || l.includes('script')) return <Code size={iconSize} />;
  if (t === 'database' || l.includes('database')) return <Database size={iconSize} />;
  if (t === 'http' || l.includes('http')) return <Globe size={iconSize} />;
  if (t === 'slack' || l.includes('slack')) return <MessageSquare size={iconSize} />;
  if (t === 'branchtoone' || l.includes('branch to one')) return <ArrowRight size={iconSize} />;
  if (t === 'branchtoall' || l.includes('branch to all')) return <ArrowDownRight size={iconSize} />;
  if (t === 'branch' || l.includes('branch')) return <GitBranch size={iconSize} />;
  if (t === 'forloop' || l.includes('for loop')) return <RotateCw size={iconSize} />;
  if (t === 'whileloop' || l.includes('while loop')) return <RotateCw size={iconSize} />;
  if (t === 'loop' || l.includes('loop')) return <Repeat size={iconSize} />;
  if (t === 'flow' || l.includes('flow')) return <Menu size={iconSize} />;
  if (t === 'delay' || l.includes('delay')) return <Clock size={iconSize} />;
  if (t === 'approval' || l.includes('approval') || l.includes('prompt')) return <CheckCircle2 size={iconSize} />;
  if (t === 'error' || l.includes('error')) return <AlertCircle size={iconSize} />;
  if (t === 'email' || l.includes('email')) return <Mail size={iconSize} />;
  if (t === 'file' || l.includes('file')) return <FileText size={iconSize} />;
  if (t === 'api' || l.includes('api')) return <Server size={iconSize} />;
  if (l.includes('trigger') || t === 'trigger' || t === 'manual') return <Zap size={iconSize} />;
  if (t === 'start' || l.includes('start')) return <Play size={iconSize} />;
  return <Play size={iconSize} />;
};

export const CustomNode = memo(({ data, selected }: any) => {
  const nodeType = data.type || 'default';
  const category = getCategoryFromType(nodeType);
  const shape = getNodeShape(nodeType);
  const colors = categoryColors[category];
  const isTested = data.isTested || false; // Флаг успешного тестирования (Run Test)

  const nodeClasses = [
    'futuristic-node',
    `node-${shape}`,
    `node-category-${category}`,
    selected ? 'node-selected' : '',
    isTested ? 'node-tested' : ''
  ].filter(Boolean).join(' ');

  const nodeStyle = {
    '--node-border-color': colors.border,
    '--node-glow-color': colors.glow,
    '--node-bg-color': colors.bg,
    '--node-gradient': colors.gradient,
    overflow: 'visible' as const,
    ...(shape === 'diamond' ? { width: '80px', height: '80px', minWidth: '80px', minHeight: '80px', maxWidth: '80px', maxHeight: '80px' } : {}),
    ...(shape === 'circle' ? { width: '60px', height: '60px', minWidth: '60px', minHeight: '60px', maxWidth: '60px', maxHeight: '60px' } : {}),
    ...(shape === 'square' ? { width: '80px', height: '80px', minWidth: '80px', minHeight: '80px', maxWidth: '80px', maxHeight: '80px' } : {}),
    ...(shape === 'rectangle' ? { width: '300px', height: '80px', minWidth: '300px', minHeight: '80px', maxWidth: '300px', maxHeight: '80px', boxSizing: 'border-box' } : {}),
  } as React.CSSProperties;

  // Для ромбовидных узлов (branch) используем специальную разметку
  if (shape === 'diamond') {
    return (
      <div className={`${nodeClasses} node-with-label`} style={nodeStyle}>
        <Handle type="target" position={Position.Left} className="handle-neon" />
        <div className="node-icon-only">
          {getIcon(nodeType, data.label || '')}
        </div>
        <Handle type="source" position={Position.Right} id="true" className="handle-neon" />
        <Handle type="source" position={Position.Bottom} id="false" className="handle-neon" />
        
        {/* Текстовая подпись под узлом */}
        {data.label && (
          <div className="node-label">
            {data.label}
          </div>
        )}
      </div>
    );
  }

  // Для круглых узлов (ресурсы)
  if (shape === 'circle') {
    return (
      <div className={`${nodeClasses} node-with-label`} style={nodeStyle}>
        <Handle type="target" position={Position.Left} className="handle-neon" />
        <div className="node-icon-only">
          {getIcon(nodeType, data.label || '')}
        </div>
        <Handle type="source" position={Position.Right} className="handle-neon" />
        
        {/* Текстовая подпись под узлом */}
        {data.label && (
          <div className="node-label">
            {data.label}
          </div>
        )}
      </div>
    );
  }

  // Прямоугольные узлы (AI Agent)
  if (shape === 'rectangle') {
    // Используем объект стилей, который React преобразует в инлайновые стили.
    // Для гарантии перекрытия !important в React используется специальный синтаксис или прямое манипулирование.
    const forcedStyle = {
      ...nodeStyle,
      width: '300px',
      height: '80px',
      minWidth: '300px',
      minHeight: '80px',
      maxWidth: '300px',
      maxHeight: '80px',
    };
    
    return (
      <div 
        className={`${nodeClasses}`} 
        style={forcedStyle}
        data-type="aiagent"
      >
        {/* Main input/output handles */}
        <Handle type="target" position={Position.Left} className="handle-neon" />
        <Handle type="source" position={Position.Right} className="handle-neon" />
        
        {/* Node content */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          padding: '0 16px',
          gap: '12px'
        }}>
          {/* Icon */}
          <div style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--node-border-color)'
          }}>
            {getIcon(nodeType, data.label || '')}
          </div>
          
          {/* Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            flex: 1
          }}>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-main)',
              fontWeight: 600,
              lineHeight: '1.1'
            }}>
              {data.label || 'AI Agent'}
            </div>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-dim)',
              lineHeight: '1.1'
            }}>
              {data.subtitle || 'Tools Agent'}
            </div>
          </div>
        </div>

        {/* Bottom connection points */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 10,
          transform: 'translateY(50%)'
        }}>
          {/* Chat Model connection */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <Handle 
              type="source" 
              position={Position.Bottom} 
              id="chatmodel"
              className="handle-neon handle-diamond"
              style={{
                position: 'relative',
                left: 'auto',
                right: 'auto',
                bottom: 'auto'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '12px',
              fontSize: '9px',
              color: 'var(--text-dim)',
              whiteSpace: 'nowrap'
            }}>
              Chat Model*
            </div>
          </div>

          {/* Memory connection */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <Handle 
              type="source" 
              position={Position.Bottom} 
              id="memory"
              className="handle-neon handle-diamond"
              style={{
                position: 'relative',
                left: 'auto',
                right: 'auto',
                bottom: 'auto'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '12px',
              fontSize: '9px',
              color: 'var(--text-dim)',
              whiteSpace: 'nowrap'
            }}>
              Memory
            </div>
          </div>

          {/* Tool connection */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <Handle 
              type="source" 
              position={Position.Bottom} 
              id="tool"
              className="handle-neon handle-diamond"
              style={{
                position: 'relative',
                left: 'auto',
                right: 'auto',
                bottom: 'auto'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '12px',
              fontSize: '9px',
              color: 'var(--text-dim)',
              whiteSpace: 'nowrap'
            }}>
              Tool
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Квадратные узлы (по умолчанию)
  return (
    <div className={`${nodeClasses} node-with-label`} style={nodeStyle}>
      {/* Вход слева только для не-триггеров */}
      {category !== 'trigger' && (
        <Handle type="target" position={Position.Left} className="handle-neon" />
      )}
      
      {/* Иконка триггера (молния) для триггеров */}
      {category === 'trigger' && (
        <div className="node-trigger-icon" style={{
          position: 'absolute',
          top: '50%',
          left: '-28px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          transform: 'translateY(-50%)'
        }}>
          <Zap size={24} style={{ color: '#f97316', strokeWidth: 2 }} />
        </div>
      )}
      
      <div className="node-icon-only">
        {getIcon(nodeType, data.label || '')}
      </div>

      {/* Выход справа для всех */}
      <Handle type="source" position={Position.Right} className="handle-neon" />
      
      {/* Текстовая подпись под узлом */}
      {data.label && (
        <div className="node-label" style={{
          position: 'absolute',
          bottom: '-24px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontSize: '12px',
          color: 'var(--text-main)',
          textAlign: 'center',
          maxWidth: '120px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          zIndex: 5
        }}>
          {data.label}
        </div>
      )}
    </div>
  );
});
