
import React from 'react'

const ClassicPreview = ({ resumeData }) => {
    return (
        <div style={{ padding: '40px', fontFamily: 'serif' }}>
            <h1 style={{ borderBottom: '2px solid black' }}>{resumeData.personalInfo.fullName}</h1>
            <p>Template Clássico (Em Breve)</p>
        </div>
    )
}

export default ClassicPreview
