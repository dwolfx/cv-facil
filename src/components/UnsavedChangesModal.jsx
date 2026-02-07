
import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

const UnsavedChangesModal = ({ isOpen, onCancel, onConfirm, onSave }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full shrink-0">
                            <AlertTriangle className="text-amber-600 dark:text-amber-500" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                Alterações não salvas
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Você tem alterações não salvas no seu currículo. Se sair agora, você perderá todo o progresso feito desde o último salvamento.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancelar (Ficar)
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-lg transition-colors"
                    >
                        Sair sem salvar
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 text-sm font-bold text-white bg-[var(--primary)] hover:brightness-110 rounded-lg shadow-sm shadow-orange-200 transition-all transform active:scale-95"
                    >
                        Salvar e Sair
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UnsavedChangesModal
