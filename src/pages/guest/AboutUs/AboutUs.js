const AboutUs = () => {
    return (
        <>
            <div className="guest-bg py-5">
                <div className="container text-dark">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-lg-10 col-xl-8">
                            <div className="p-5 shadow rounded-lg border-0 bg-white">
                                <div className="mb-4 text-center">
                                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-3">
                                        System Overview
                                    </span>
                                    <h1 className="text-bold mb-3">
                                        About the System
                                    </h1>
                                    <p className="text-muted">
                                        Alumni Tracking & Intelligent Job Placement Platform
                                    </p>
                                </div>

                                <div className="fs-5 text-secondary">
                                    <p className="mb-4">
                                        The <strong>Abuyog Community College Alumni Tracking and Job Placement System with Recommender System</strong> is a modern web-based platform designed to manage alumni records while supporting employment opportunities through intelligent job recommendations.
                                    </p>

                                    <p className="mb-4">
                                        It strengthens the connection between <strong>alumni</strong>, <strong> employers</strong>, and the <strong>institution</strong> by maintaining a centralized database of alumni profiles, employment status, skills, and job opportunities. A built-in recommender system suggests suitable job openings based on alumni skills, preferences, and assessment results.
                                    </p>

                                    <p>
                                        By digitizing alumni tracking and job placement processes, the system improves employment monitoring, data-driven analysis, and decision-making for the college.
                                    </p>
                                </div>

                                <div className="row mt-5 border-top border-light pt-4">
                                    <div className="col-xl-6 text-left">
                                        <small className="text-muted mb-2 mb-md-0">
                                            © {new Date().getFullYear()} Abuyog Community College
                                        </small>
                                    </div>
                                    <div className="col-xl-6 text-right">
                                        <a href="mailto:francosalamanca13@gmail.com" className="text-decoration-none fw-semibold text-success text-center">
                                            francosalamanca13@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutUs