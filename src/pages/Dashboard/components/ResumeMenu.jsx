import React from 'react';
import { Edit2, Copy, Download, Languages, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ResumeMenu.css';

const ResumeMenu = ({ 
  resume, 
  onStartRenaming, 
  onDuplicate, 
  onDownload, 
  onTranslate, 
  onDelete 
}) => {
  const navigate = useNavigate();

  return (
    <div className="resume-menu-container" onClick={(e) => e.stopPropagation()}>
      {/* Edição */}
      <div className="resume-menu-section">Edição</div>
      <button 
        className="resume-menu-item"
        onClick={() => navigate(`/editor?id=${resume.id}`)}
      >
        <div className="resume-menu-item-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
          <Edit2 size={14} />
        </div>
        <div className="resume-menu-item-content">
          <span className="resume-menu-item-title">Editar</span>
          <span className="resume-menu-item-desc">Conteúdo e design</span>
        </div>
      </button>

      <button 
        className="resume-menu-item"
        onClick={(e) => onStartRenaming(e, resume)}
      >
        <div className="resume-menu-item-icon" style={{ backgroundColor: 'var(--slate-100)', color: 'var(--slate-500)' }}>
          <MoreVertical size={14} />
        </div>
        <div className="resume-menu-item-content">
          <span className="resume-menu-item-title">Renomear</span>
          <span className="resume-menu-item-desc">Título do documento</span>
        </div>
      </button>

      {/* Arquivo */}
      <div className="resume-menu-divider"></div>
      <div className="resume-menu-section">Arquivo</div>
      <button 
        className="resume-menu-item"
        onClick={(e) => onDuplicate(e, resume)}
      >
        <div className="resume-menu-item-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
          <Copy size={14} />
        </div>
        <div className="resume-menu-item-content">
          <span className="resume-menu-item-title">Duplicar</span>
          <span className="resume-menu-item-desc">Criar uma cópia</span>
        </div>
      </button>

      <button 
        className="resume-menu-item"
        onClick={(e) => onDownload(resume)}
      >
        <div className="resume-menu-item-icon" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
          <Download size={14} />
        </div>
        <div className="resume-menu-item-content">
          <span className="resume-menu-item-title">Baixar PDF</span>
          <span className="resume-menu-item-desc">Exportação final</span>
        </div>
      </button>

      {/* Tradução */}
      <div className="resume-menu-divider"></div>
      <div className="resume-menu-section">Tradução</div>
      <button 
        className="resume-menu-item translate-en"
        onClick={(e) => onTranslate(e, resume, 'EN-US')}
      >
        <div className="resume-menu-item-icon" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
          <Languages size={14} />
        </div>
        <div className="resume-menu-item-content">
          <span className="resume-menu-item-title">English [EN]</span>
          <span className="resume-menu-item-desc">Traduzir para Inglês</span>
        </div>
      </button>

      <button 
        className="resume-menu-item translate-es"
        onClick={(e) => onTranslate(e, resume, 'ES')}
      >
        <div className="resume-menu-item-icon" style={{ backgroundColor: '#fff7ed', color: '#c2410c' }}>
          <Languages size={14} />
        </div>
        <div className="resume-menu-item-content">
          <span className="resume-menu-item-title">Español [ES]</span>
          <span className="resume-menu-item-desc">Traduzir para Espanhol</span>
        </div>
      </button>

      {/* Perigo */}
      <div className="resume-menu-divider"></div>
      <button 
        className="resume-menu-item danger"
        onClick={(e) => onDelete(resume.id)}
      >
        <div className="resume-menu-item-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
          <Trash2 size={14} />
        </div>
        <span className="resume-menu-item-title">Remover</span>
      </button>
    </div>
  );
};

export default ResumeMenu;
