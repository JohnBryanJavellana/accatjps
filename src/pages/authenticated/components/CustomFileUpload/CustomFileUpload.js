import React, { useState } from 'react'

const CustomFileUpload = ({ id, label, description, file, setFile, icon, color, required = false }) => {
    const [isDragging, setIsDragging] = useState(false);
    const isUploaded = !!file;

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;

        if (selectedFile.size > 5 * 1024 * 1024) {
            alert("File is too large. Please upload a file smaller than 5MB.");
            return;
        }

        setFile(selectedFile);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="col-xl-12 mb-3">
            <div
                className={`h-100 border-0 shadow-sm transition-all ${isUploaded ? 'bg-white' : 'bg-light'} ${isDragging ? 'border-primary' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                style={{
                    borderRadius: '16px',
                    transition: 'all 0.2s ease-in-out',
                    border: isDragging
                        ? `2px dashed ${color}`
                        : (isUploaded ? `1px solid ${color}40` : '1px solid #eef2f6'),
                    position: 'relative',
                    transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                    backgroundColor: isDragging ? `${color}05` : undefined
                }}
            >
                {/* Required Tag */}
                {required && !isUploaded && (
                    <div style={{
                        position: 'absolute', top: '12px', right: '15px',
                        fontSize: '9px', fontWeight: 'bold', color: '#dc3545',
                        textTransform: 'uppercase'
                    }}>
                        * Required
                    </div>
                )}

                <div className="p-3 d-flex flex-column h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{
                                width: '40px', height: '40px',
                                backgroundColor: isUploaded ? '#E8F5E9' : 'white',
                                color: isUploaded ? '#2E7D32' : color
                            }}
                        >
                            <i className={isUploaded ? 'fas fa-check' : (isDragging ? 'fas fa-arrow-down' : icon)}></i>
                        </div>
                        {isUploaded && (
                            <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1" style={{ fontSize: '10px' }}>
                                READY TO SEND
                            </span>
                        )}
                    </div>

                    <div className="mb-3">
                        <h6 className="fw-bold mb-0" style={{ fontSize: '14px', color: '#334155' }}>{label}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{description}</p>
                    </div>

                    {/* Interaction Area */}
                    <div className="mt-auto">
                        {!isUploaded ? (
                            <button
                                type="button"
                                className={`btn w-100 py-2 shadow-sm ${isDragging ? 'btn-primary' : 'btn-white border'}`}
                                style={{ borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}
                                onClick={() => document.getElementById(id).click()}
                            >
                                <i className="fa-solid fa-cloud-arrow-up me-2"></i>
                                {isDragging ? 'Drop File Now' : 'Select or Drag File'}
                            </button>
                        ) : (
                            <div className="bg-light rounded-3 p-2 border border-light-subtle d-flex align-items-center">
                                {/* Clickable area to change file */}
                                <div
                                    className="flex-grow-1 overflow-hidden me-2"
                                    role="button"
                                    onClick={() => document.getElementById(id).click()}
                                    style={{ cursor: 'pointer', minWidth: 0 }}
                                    title="Click to change file"
                                >
                                    <div className="text-dark fw-bold" style={{ fontSize: '11px', lineHeight: '20px' }}>
                                        {file.name}
                                    </div>
                                    <div className="text-primary" style={{ fontSize: '9px', fontWeight: '600' }}>
                                        <i className="fas fa-sync-alt mr-1"></i> Replace File
                                    </div>
                                </div>

                                <button
                                    className="btn btn-link text-danger p-1"
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                    }}
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    <input
                        type="file" id={id} hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                </div>
            </div>
        </div>
    );
}

export default CustomFileUpload