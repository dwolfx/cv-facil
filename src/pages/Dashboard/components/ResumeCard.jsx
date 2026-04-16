import React from 'react';
import { MoreVertical, Edit2, Download, Trash2, Clock, Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResumeMenu from './ResumeMenu';
import './ResumeCard.css';

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
  onDelete 
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
              <span className={`cv-badge ${lang.colorClass}`}>
                {lang.label}
              </span>
              <h3 className="cv-title" title={resume.title}>
                {resume.title?.replace(/ /g, '\u00a0') || 'Sem Título'}
              </h3>
            </div>
          )}
          
          <div className="cv-meta">
            <Clock size={12} />
            <span>Atualizado em {formatDate(resume.updated_at)}</span>
          </div>

          <div className="cv-strength-container">
            <div className="cv-strength-bar-bg">
              <div className="cv-strength-bar-fill" style={{ width: `${resume.strength || 0}%` }}></div>
            </div>
            <span className="cv-strength-value">{resume.strength || 0}%</span>
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
