import React from 'react';
import { useNavigate } from 'react-router-dom';

const InfoBoard = () => {
    const navigate = useNavigate();

    return (
        <div className="guest-bg py-5">
            <div className="container text-dark">
                <div className="row justify-content-center">
                    <div className="col-lg-12 col-xl-10">
                        <div className="p-4 shadow rounded-lg border bg-white">
                            <div className="mb-4 text-center">
                                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-3">
                                    Information Board
                                </span>
                                <h2 className="text-bold mb-3">ACC Alumni Association</h2>
                                <p className="text-muted">
                                    Organization Structure & Manuals
                                </p>
                            </div>

                            {/* Organization Structure Image */}
                            <div className="mb-4 text-center">
                                <div className="shadow rounded-lg border p-3 bg-white d-inline-block">
                                    <img
                                        src="/system-images/AAORGSTRUC.jpg"
                                        alt="ACC Alumni Association Organization Structure"
                                        className="img-fluid rounded"
                                        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                                    />
                                </div>
                            </div>

                            {/* Downloadable Manuals with 10px spacing */}
                            <div className="text-center mb-4">
                                <a
                                    href="/system-images/ACCAlumniAssociationOperationsManual.docx"
                                    download
                                    className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
                                    style={{ marginRight: '10px' }}
                                >
                                    Download Alumni Operations Manual
                                </a>
                                <a
                                    href="/system-images/ACCJobPlacementOperationsManual.docx"
                                    download
                                    className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
                                >
                                    Download Job Placement Manual
                                </a>
                            </div>

                            {/* Return button */}
                            <div className="text-center mt-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
                                >
                                    <i className="fas fa-chevron-left me-2"></i>Return to Previous
                                </button>
                            </div>
                        </div>
                        {/* End card */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoBoard;
