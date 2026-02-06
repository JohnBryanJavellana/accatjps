import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
    { id: 1, img: "/system-images/1.jpg", text: "Alumni Homecoming 2023" },
    { id: 2, img: "/system-images/2.jpg", text: "Alumni Homecoming 2023" },
    { id: 3, img: "/system-images/3.jpg", text: "Alumni Homecoming 2023" },
    { id: 4, img: "/system-images/4.jpg", text: "Alumni Homecoming 2023" },
];

const Gallery = () => {
    const navigate = useNavigate();
    const [slideIndex, setSlideIndex] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex(prev => (prev >= slides.length ? 1 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const plusSlides = (n) => {
        setSlideIndex(prev => {
            let next = prev + n;
            if (next > slides.length) return 1;
            if (next < 1) return slides.length;
            return next;
        });
    };

    const currentSlide = (n) => setSlideIndex(n);

    return (
        <div className="guest-bg py-5">
            <div className="container text-dark">
                <div className="row justify-content-center">
                    <div className="col-lg-12 col-xl-10">
                        <div className="p-4 shadow rounded-lg border bg-white">
                            <div className="mb-4 text-center">
                                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-3">
                                    Alumni Gallery
                                </span>
                                <h2 className="text-bold mb-3">Memories & Events</h2>
                                <p className="text-muted">
                                    Check out moments from our alumni homecomings and events.
                                </p>
                            </div>

                            {/* Slideshow */}
                            <div className="slideshow-container position-relative mb-4" style={{ height: '500px' }}>
                                {slides.map((slide, index) => (
                                    <div
                                        key={slide.id}
                                        className={`position-absolute w-100 h-100 ${slideIndex === index + 1 ? '' : 'd-none'}`}
                                    >
                                        <img
                                            src={slide.img}
                                            alt={slide.text}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    </div>
                                ))}

                                {/* Navigation buttons */}
                                <button
                                    className="prev btn btn-light position-absolute top-50 start-0 translate-middle-y"
                                    onClick={() => plusSlides(-1)}
                                    style={{ zIndex: 10 }}
                                >
                                    &#10094;
                                </button>
                                <button
                                    className="next btn btn-light position-absolute top-50 end-0 translate-middle-y"
                                    onClick={() => plusSlides(1)}
                                    style={{ zIndex: 10 }}
                                >
                                    &#10095;
                                </button>
                            </div>

                            {/* Dots */}
                            <div className="text-center mb-4">
                                {slides.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`mx-1 rounded-circle ${slideIndex === index + 1 ? 'bg-success' : 'bg-secondary'}`}
                                        onClick={() => currentSlide(index + 1)}
                                        style={{ cursor: 'pointer', height: '12px', width: '12px', display: 'inline-block' }}
                                    ></span>
                                ))}
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

                            {/* Footer */}

                        </div>
                        {/* End card */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
