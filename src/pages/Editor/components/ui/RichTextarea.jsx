import React, { useRef, useEffect } from 'react'
import { List } from 'lucide-react'

const RichTextarea = ({ value, onChange, placeholder, className, maxLength = 2000 }) => {
    const textareaRef = useRef(null)

    // History for Undo/Redo
    const historyRef = useRef([value || ''])
    const historyIndexRef = useRef(0)
    const timeoutRef = useRef(null)
    const isUndoing = useRef(false)

    // Auto-resize
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [value])

    // Save logic
    const saveToHistory = (newValue) => {
        if (isUndoing.current) return

        // If we are back in time, truncate future
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
        }

        // Only save if different from the current top of the history stack
        if (newValue !== historyRef.current[historyIndexRef.current]) {
            historyRef.current.push(newValue)
            historyIndexRef.current = historyRef.current.length - 1
        }
    }

    // Capture changes to history (Debounced)
    useEffect(() => {
        if (value === undefined || value === null) return

        // Only save if the value is different from the current history point
        // and it's not an undo/redo operation
        if (!isUndoing.current && value !== historyRef.current[historyIndexRef.current]) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)

            // Standard typing: debounce save
            timeoutRef.current = setTimeout(() => {
                saveToHistory(value)
            }, 800)
        }
    }, [value])

    const handleKeyDown = (e) => {
        // Undo: Ctrl+Z | Redo: Ctrl+Shift+Z or Ctrl+Y
        if (e.ctrlKey || e.metaKey) {
            if (e.key.toLowerCase() === 'z') {
                e.preventDefault()

                if (e.shiftKey) {
                    // REDO (Ctrl+Shift+Z)
                    if (historyIndexRef.current < historyRef.current.length - 1) {
                        isUndoing.current = true
                        historyIndexRef.current++
                        const newValue = historyRef.current[historyIndexRef.current]
                        const event = { target: { value: newValue } }
                        onChange(event)
                        setTimeout(() => isUndoing.current = false, 0)
                    }
                } else {
                    // UNDO (Ctrl+Z)
                    if (historyIndexRef.current > 0) {
                        isUndoing.current = true
                        historyIndexRef.current--
                        const newValue = historyRef.current[historyIndexRef.current]
                        const event = { target: { value: newValue } }
                        onChange(event)
                        setTimeout(() => isUndoing.current = false, 0)
                    }
                }
            } else if (e.key.toLowerCase() === 'y') {
                // REDO (Ctrl+Y) - Alternative standard
                e.preventDefault()
                if (historyIndexRef.current < historyRef.current.length - 1) {
                    isUndoing.current = true
                    historyIndexRef.current++
                    const newValue = historyRef.current[historyIndexRef.current]
                    const event = { target: { value: newValue } }
                    onChange(event)
                    setTimeout(() => isUndoing.current = false, 0)
                }
            }
        }
    }

    const handleInsert = (marker) => {
        if (!textareaRef.current) return

        // Force save current state before programmatic change
        saveToHistory(value || '')

        const start = textareaRef.current.selectionStart
        const end = textareaRef.current.selectionEnd
        const text = value || ''

        let newText = ''
        let newSelectionStart = start
        let newSelectionEnd = end

        if (marker === 'bullet') {
            // Find start of the line where selection begins
            let lineStart = text.lastIndexOf('\n', start - 1) + 1
            if (lineStart < 0) lineStart = 0

            // Find end of the line where selection ends
            let lineEnd = text.indexOf('\n', end)
            if (lineEnd === -1) lineEnd = text.length

            const beforeBlock = text.substring(0, lineStart)
            const block = text.substring(lineStart, lineEnd)
            const afterBlock = text.substring(lineEnd)

            const lines = block.split('\n')

            // Check if we are "adding" or "removing" (Standard toggle behavior)
            // If all selected lines have bullets, we remove them. Otherwise we add to all.
            const allHaveBullet = lines.every(line => line.trim().startsWith('• '))

            const processedLines = lines.map(line => {
                if (!line.trim()) return line; // Skip empty lines

                if (allHaveBullet) {
                    return line.replace(/^\s*•\s?/, '')
                } else {
                    return line.trim().startsWith('• ') ? line : `• ${line}`
                }
            })

            const newBlock = processedLines.join('\n')
            newText = beforeBlock + newBlock + afterBlock

            // Adjust Selection to cover the modified block
            newSelectionStart = lineStart
            newSelectionEnd = lineStart + newBlock.length
        }

        if (newText) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(textareaRef.current, newText);

            const event = new Event('input', { bubbles: true });
            textareaRef.current.dispatchEvent(event);

            setTimeout(() => {
                textareaRef.current.focus()
                textareaRef.current.setSelectionRange(newSelectionStart, newSelectionEnd)
                // Save state after programmatic insert
                saveToHistory(newText)
            }, 0)
        }
    }

    return (
        <div className="group border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-400 transition-all bg-white">
            {/* Toolbar */}
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => handleInsert('bullet')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 hover:text-[var(--primary)] transition-all"
                    title="Adicionar Marcador (Bullet Point)"
                >
                    <List size={15} strokeWidth={2.5} />
                </button>
            </div>

            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full p-3 bg-white outline-none resize-none text-sm text-slate-700 leading-relaxed block"
                style={{ overflow: 'hidden', minHeight: '100px' }}
                maxLength={maxLength}
            />

            <div className="text-[10px] text-slate-400 text-right py-1 px-2 bg-slate-50/50 font-mono border-t border-slate-100">
                {value?.length || 0}/{maxLength}
            </div>
        </div>
    )
}

export default RichTextarea
