import React, { useState } from 'react'
import { Upload, FileText, Image, X } from 'lucide-react'
import './ImportModal.css'

const ImportModal = ({ isOpen, onClose, onImport }) => {
    const [isDragging, setIsDragging] = useState(false)

    if (!isOpen) return null

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (file) => {
        // Here we would call the actual import logic
        onImport(file)
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content glass animate-scale-in">
                <button className="modal-close" onClick={onClose}><X size={20} /></button>

                <div className="modal-header">
                    <h2>Importar Currículo</h2>
                    <p>Selecione um arquivo para preencher automaticamente.</p>
                </div>

                <div
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Upload size={48} className="drop-icon" />
                    <p>Arraste e solte seu arquivo aqui</p>
                    <span>ou</span>
                    <label className="btn btn-primary">
                        Escolher Arquivo
                        <input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,image/*" />
                    </label>
                    <div className="supported-formats">
                        <span className="format-tag"><FileText size={14} /> PDF, DOCX, TXT</span>
                        <span className="format-tag"><Image size={14} /> Imagem (OCR)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportModal
