import React, { useState, useEffect } from 'react';
import './Home.css';
import useGetToken from '../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../hooks/useSystemURLCon';
import SkeletonLoader from '../../authenticated/components/SkeletonLoader/SkeletonLoader';
import useDateFormat from '../../../hooks/useDateFormat';
import axios from 'axios';
import ModalAnnouncement from '../../authenticated/admin/announcement/components/ModalAnnouncement';
import TablePaginationTemplate from '../../authenticated/components/TablePaginationTemplate';

const Home = () => {
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const { formatDateToReadable } = useDateFormat();
    const [modalOpenId, setModalOpenId] = useState(0);
    const [modalIndex, setModalIndex] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState('NO');
    const [modalData, setModalData] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    useEffect(() => {
        GetAnnouncements(true);
        return () => { };
    }, []);

    const GetAnnouncements = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);
            const formData = new FormData();
            formData.append("can_message", "0");

            const response = await axios.post(`${url}/get-announcements`, formData, {});
            setAnnouncements(response.data.announcements);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    const slides = [
        { id: 1, img: "/system-images/1.jpg", text: "Alumni Homecoming 2023" },
        { id: 2, img: "/system-images/2.jpg", text: "Alumni Homecoming 2023" },
        { id: 3, img: "/system-images/3.jpg", text: "Alumni Homecoming 2023" },
        { id: 4, img: "/system-images/4.jpg", text: "Alumni Homecoming 2023" },
    ];

    const [slideIndex, setSlideIndex] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex >= slides.length ? 1 : prevIndex + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const plusSlides = (n) => {
        setSlideIndex((prevIndex) => {
            let nextIndex = prevIndex + n;
            if (nextIndex > slides.length) return 1;
            if (nextIndex < 1) return slides.length;
            return nextIndex;
        });
    };

    const currentSlide = (n) => {
        setSlideIndex(n);
    };

    return (
        isFetching
            ? <SkeletonLoader />
            : <div className="home-wrapper">
                <div className="slide_pad">
                    <div className="slideshow-container">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`mySlides customFade ${slideIndex === index + 1 ? 'active-slide' : ''}`}
                            >
                                <img src={slide.img} alt={`Slide ${slide.id}`} />
                                <div className="text">{slide.text}</div>
                            </div>
                        ))}

                        <button className="prev" onClick={() => plusSlides(-1)}>&#10094;</button>
                        <button className="next" onClick={() => plusSlides(1)}>&#10095;</button>
                    </div>

                    <div className="dot-container">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${slideIndex === index + 1 ? 'active' : ''}`}
                                onClick={() => currentSlide(index + 1)}
                            ></span>
                        ))}
                    </div>
                </div>

                {
                    modalIndex === 0 &&
                    <ModalAnnouncement
                        data={modalData}
                        id={modalOpenId}
                        modalTitle={`View Announcement`}
                        callbackFunction={(e) => {
                            GetAnnouncements(false);
                            setIsModalOpen('NO');
                            setModalData(null);
                            setModalIndex(null);
                        }}
                    />
                }

                <main>
                    <div className="padding-wrapper mb-5">
                        <div className="container text-dark">
                            <h4 className='text-bold mb-3'>Announcements</h4>

                            {
                                announcements.length > 0 ? (
                                    <>
                                        {
                                            announcements.map((a, index) => {
                                                const charLimit = 180;
                                                const isLong = a.content?.length > charLimit;
                                                const previewText = isLong
                                                    ? a.content.substring(0, charLimit) + "..."
                                                    : a.content;

                                                return (
                                                    <div key={index} className="announcement-card mb-4 border-0 shadow-sm rounded bg-white overflow-hidden">
                                                        <div className="p-4">
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h3 className="h5 fw-bold text-dark mb-0" style={{ lineHeight: '1.4' }}>
                                                                    {a.title}
                                                                </h3>
                                                            </div>

                                                            <div className="text-muted mb-3" style={{ fontSize: '12px' }}>
                                                                <i className="far fa-calendar-alt mr-1 text-success"></i>
                                                                <span className="fw-medium">{formatDateToReadable(a.created_at, true)}</span>
                                                            </div>

                                                            <p className="text-secondary mb-3" style={{ fontSize: '14.5px', lineHeight: '1.6', textAlign: 'justify' }}>
                                                                {previewText}
                                                            </p>

                                                            <button
                                                                className="btn btn-link p-0 text-success fw-bold text-decoration-none d-flex align-items-center"
                                                                style={{ fontSize: '14px', transition: 'gap 0.2s' }}
                                                                data-toggle="modal"
                                                                data-target={`#announcement_info_${a.id}`}
                                                                onClick={() => {
                                                                    setIsModalOpen('YES');
                                                                    setModalOpenId(a.id);
                                                                    setModalIndex(0);
                                                                    setModalData(a);
                                                                }}
                                                            >
                                                                Read Full Announcement
                                                                <i className="fas fa-arrow-right ml-2" style={{ fontSize: '11px' }}></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }

                                        <TablePaginationTemplate
                                            dataset={announcements}
                                            rowsPerPage={rowsPerPage}
                                            rowsPerPageOptions={[12, 24, 36, 50]}
                                            page={page}
                                            labelRowsPerPage={"Announcements per page:"}
                                            callbackFunction={(e) => {
                                                setRowsPerPage(e.rows);
                                                setPage(e.page);
                                            }}
                                        />
                                    </>
                                ) : (
                                    /* Empty State */
                                    <div className="py-5 px-4 text-center d-flex flex-column align-items-center justify-content-center border rounded-3 bg-white shadow-sm"
                                        style={{ minHeight: '350px', borderStyle: 'dashed', borderWidth: '2px', borderColor: '#dee2e6' }}>

                                        <div className="mb-4 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '50%',
                                                color: '#dee2e6'
                                            }}>
                                            <i className="fas fa-bullhorn fa-3x"></i>
                                        </div>

                                        <h4 className="fw-bold text-dark mb-2">No Announcements Yet</h4>
                                        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '350px', fontSize: '14px', lineHeight: '1.6' }}>
                                            Check back soon for the latest news, events, and important updates from the University Alumni Office.
                                        </p>

                                        <div className="text-uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px', color: '#adb5bd' }}>
                                            <i className="fas fa-info-circle me-1"></i> Stay Tuned
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </main>
            </div>
    );
};

export default Home;