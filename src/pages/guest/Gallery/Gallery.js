import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Gallery = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="guest-bg d-flex align-items-center min-vh-100 bg-white">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 col-lg-5 col-xl-4">
                            <div className="card border-0 shadow-lg rounded-lg overflow-hidden" style={{ borderRadius: '1.25rem' }}>
                                <div className="bg-success" style={{ height: '5px' }}></div>

                                <div className="card-body p-5 text-center">
                                    {/* Circular Icon Wrapper */}
                                    <div className="mb-4 d-inline-flex align-items-center justify-content-center bg-light rounded-circle shadow-sm"
                                        style={{ width: '70px', height: '70px' }}>
                                        <i className="fas fa-tools fa-lg text-success"></i>
                                    </div>

                                    <h3 className="font-weight-bold text-dark mb-2">Coming Soon</h3>
                                    <p className="text-muted mb-4">
                                        We're building something great. This page will be available shortly.
                                    </p>

                                    {/* The "No-Navigation" Button */}
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="btn btn-light btn-round px-4 py-2 border shadow-sm transition-all"
                                        style={{ borderRadius: '50px', fontWeight: '500' }}
                                    >
                                        <i className="fas fa-chevron-left mr-2 small"></i>
                                        Return to Previous
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Gallery