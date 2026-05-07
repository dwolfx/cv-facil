import React from 'react';
import { PlusCircle, Lock } from 'lucide-react';
import './NewResumeCard.css';

const NewResumeCard = ({ onClick, disabled, onUpgradeClick }) => {
    if (disabled) {
        return (
            <div className="relative group">
                <button
                    className="new-resume-card glass new-resume-card--disabled"
                    onClick={onUpgradeClick}
                    type="button"
                >
                    <div className="new-resume-card-icon-container new-resume-card-icon-container--disabled">
                        <Lock size={28} />
                    </div>
                    <h3 className="new-resume-card-title">Criar Novo Currículo</h3>
                    <p className="new-resume-card-subtitle">Limite de currículos atingido</p>
                </button>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2.5 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none w-56 text-center z-20 shadow-lg">
                    Limite atingido. Assine o <span className="font-bold text-orange-400">Plano PRO</span> para criar currículos ilimitados.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900" />
                </div>
            </div>
        );
    }

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
