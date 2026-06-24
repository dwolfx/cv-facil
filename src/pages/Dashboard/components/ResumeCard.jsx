import React from 'react';
import { MoreVertical, Edit2, Download, Trash2, Clock, Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResumeMenu from './ResumeMenu';
import './ResumeCard.css';

// Flat, simple SVGs for flag indicators (no shadows, reflections or rounded masks)
const BrazilFlag = () => (
  <svg viewBox="0 0 720 504" className="cv-flag-svg" width="16" height="11">
    <rect width="720" height="504" fill="#009739" />
    <path d="M360 40L680 252L360 464L40 252Z" fill="#FFD300" />
    <circle cx="360" cy="252" r="105" fill="#002776" />
    <path d="M260 270c10-25 40-40 85-35c35 4 60 18 75 35" stroke="white" strokeWidth="12" fill="none" />
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 60 30" className="cv-flag-svg" width="16" height="11">
    <rect width="60" height="30" fill="#012169" />
    <line x1="0" y1="0" x2="60" y2="30" stroke="white" strokeWidth="6" />
    <line x1="60" y1="0" x2="0" y2="30" stroke="white" strokeWidth="6" />
    <line x1="0" y1="0" x2="60" y2="30" stroke="#C8102E" strokeWidth="2" />
    <line x1="60" y1="0" x2="0" y2="30" stroke="#C8102E" strokeWidth="2" />
    <line x1="30" y1="0" x2="30" y2="30" stroke="white" strokeWidth="10" />
    <line x1="0" y1="15" x2="60" y2="15" stroke="white" strokeWidth="10" />
    <line x1="30" y1="0" x2="30" y2="30" stroke="#C8102E" strokeWidth="6" />
    <line x1="0" y1="15" x2="60" y2="15" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const SpainFlag = () => (
  <svg viewBox="0 0 750 500" className="cv-flag-svg" width="16" height="11">
    <rect width="750" height="500" fill="#FFC72C" />
    <rect width="750" height="125" fill="#C8102E" />
    <rect y="375" width="750" height="125" fill="#C8102E" />
    <rect x="180" y="200" width="40" height="60" fill="#C8102E" />
    <circle cx="200" cy="180" r="15" fill="#C8102E" />
  </svg>
);

const renderFlag = (label) => {
  switch (label) {
    case 'EN':
      return <UKFlag />;
    case 'ES':
      return <SpainFlag />;
    case 'PT-BR':
    default:
      return <BrazilFlag />;
  }
};

const ResumeCard = ({ 
  resume, 
  isLocked, 
  openMenuId, 
  onMenuClick, 
  renamingId, 
  tempTitle, 
  setTempTitle, 
  onStartRenaming, 
  onCancelRenaming, 
  onSaveRename, 
  onDuplicate, 
  onDownload, 
  onTranslate, 
  onDelete,
  onToggleShare
}) => {
  const navigate = useNavigate();

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getLanguageInfo = (title = '') => {
    const upTitle = title.toUpperCase();
    if (upTitle.includes('[EN]')) return { label: 'EN', colorClass: 'cv-badge-en' };
    if (upTitle.includes('[ES]')) return { label: 'ES', colorClass: 'cv-badge-es' };
    if (upTitle.includes('[PTBR]')) return { label: 'PT-BR', colorClass: 'cv-badge-pt' };
    return { label: 'PT-BR', colorClass: 'cv-badge-default' };
  };

  const lang = getLanguageInfo(resume.title);

  return (
    <div className={`cv-card ${isLocked ? 'locked' : ''}`} onClick={() => !isLocked && navigate(`/editor?id=${resume.id}`)}>
      
      {/* Actions Trigger */}
      {!isLocked && (
        <div className="cv-menu-trigger-container">
          <button
            onClick={(e) => onMenuClick(e, resume.id)}
            className="cv-menu-trigger"
          >
            <MoreVertical size={16} />
          </button>

          {openMenuId === resume.id && (
            <ResumeMenu 
              resume={resume}
              onStartRenaming={onStartRenaming}
              onDuplicate={onDuplicate}
              onDownload={onDownload}
              onTranslate={onTranslate}
              onDelete={onDelete}
            />
          )}
        </div>
      )}

      {/* Locked Overlay */}
      {isLocked && (
        <div className="cv-locked-badge">
          <Lock size={10} /> Bloqueado
        </div>
      )}

      {/* Preview Area */}
      <div className="cv-preview">
        <div className="cv-paper">
          {resume.content?.personalInfo?.fullName ? (
            <div className="cv-paper-content">
              <div className="cv-paper-name">{resume.content.personalInfo.fullName}</div>
              {resume.content.personalInfo.role && (
                <div className="cv-paper-role">{resume.content.personalInfo.role}</div>
              )}
              <div className="cv-paper-skeleton">
                <div className="cv-paper-line full"></div>
                <div className="cv-paper-line long"></div>
                <div className="cv-paper-line medium"></div>
                <div className="cv-paper-gap"></div>
                <div className="cv-paper-line header"></div>
                <div className="cv-paper-line full"></div>
                <div className="cv-paper-line long"></div>
              </div>
            </div>
          ) : (
            <div className="cv-paper-empty">
              <div className="cv-paper-empty-header"></div>
              <div className="cv-paper-skeleton">
                <div className="cv-paper-line medium"></div>
                <div className="cv-paper-line long"></div>
                <div className="cv-paper-line full"></div>
                <div className="cv-paper-line full"></div>
              </div>
            </div>
          )}
          <div className="cv-paper-fade"></div>
        </div>
      </div>

      {/* Info Area */}
      <div className="cv-info">
        <div>
          {renamingId === resume.id ? (
            <div className="cv-rename-container" onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="cv-rename-input"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && onSaveRename(resume.id)}
              />
              <button onClick={() => onSaveRename(resume.id)} className="cv-rename-btn success"><CheckCircle size={14} /></button>
              <button onClick={onCancelRenaming} className="cv-rename-btn danger"><Trash2 size={14} /></button>
            </div>
          ) : (
            <div className="cv-title-row">
              <h3 className="cv-title" title={resume.title}>
                {resume.title?.replace(/ /g, '\u00a0') || 'Sem Título'}
              </h3>
            </div>
          )}
          
          <div className="cv-meta">
            {renderFlag(lang.label)}
            <Clock size={12} />
            <span>Atualizado em {formatDate(resume.updated_at)}</span>
          </div>

          <div className="cv-strength-container">
            <div className="cv-strength-bar-bg">
              <div className="cv-strength-bar-fill" style={{ width: `${resume.strength || 0}%` }}></div>
            </div>
            <span className="cv-strength-value">{resume.strength || 0}%</span>
          </div>

          <div className="cv-share-container" onClick={(e) => e.stopPropagation()}>
            <label className="cv-share-label">
              <input
                type="checkbox"
                checked={resume.is_shared !== false}
                onChange={(e) => onToggleShare(resume.id, e.target.checked)}
                className="cv-share-checkbox"
                disabled={isLocked}
              />
              <span className="cv-share-text">Compartilhar com agências</span>
            </label>
          </div>
        </div>

        <div className="cv-footer">
          {isLocked ? (
            <button className="cv-btn-edit locked" disabled>
              <Lock size={14} /> Bloqueado
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/editor?id=${resume.id}`) }}
              className="cv-btn-edit"
            >
              <Edit2 size={14} /> Editar
            </button>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onDownload(resume); }}
            className="cv-btn-secondary"
            title="Baixar PDF"
          >
            <Download size={14} />
            <span className="cv-btn-text">PDF</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}
            className="cv-btn-icon"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
