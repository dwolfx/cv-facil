
import React from 'react'

const MinimalistPreview = ({ resumeData }) => {
    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem' }}>{resumeData.personalInfo.fullName}</h1>
            <p>Template Minimalista (Em Breve)</p>
        </div>
    )
}

export default MinimalistPreview
