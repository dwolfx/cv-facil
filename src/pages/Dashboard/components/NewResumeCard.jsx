import React from 'react';
import { PlusCircle } from 'lucide-react';
import './NewResumeCard.css';

const NewResumeCard = ({ onClick }) => {
  return (
    <button className="new-resume-card glass" onClick={onClick}>
      <div className="new-resume-card-icon-container">
        <PlusCircle size={28} />
      </div>
      <h3 className="new-resume-card-title">Criar Novo Currículo</h3>
      <p className="new-resume-card-subtitle">Começar do zero ou importar</p>
    </button>
  );
};

export default NewResumeCard;
