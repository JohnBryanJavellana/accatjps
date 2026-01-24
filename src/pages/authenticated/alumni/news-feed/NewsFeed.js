import React, { useEffect, useMemo, useState } from 'react'
import useGetToken from '../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import useDateFormat from '../../../../hooks/useDateFormat';
import axios from 'axios';
import TablePaginationTemplate from '../../components/TablePaginationTemplate';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import ModalCUAnnouncement from '../../admin/announcement/components/ModalCUAnnouncement';
import ModalAnnouncement from '../../admin/announcement/components/ModalAnnouncement';

const NewsFeed = () => {
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
    const [searchText, setSearchText] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(12);

    useEffect(() => {
        GetAnnouncements(true);
        return () => { };
    }, []);

    const GetAnnouncements = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const formData = new FormData();
            formData.append("can_message", "1");

            const response = await axios.post(`${url}/get-announcements`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setAnnouncements(response.data.announcements);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    const filteredNewsFeed = useMemo(() => {
        if (!searchText.trim()) return announcements;
        const term = searchText.toLowerCase();

        return announcements.filter(feed => {
            return feed?.title.toLowerCase().includes(term) ||
                feed?.content.toLowerCase().includes(term);
        });
    }, [searchText, announcements]);

    return (
        <>
            {
                !isFetching &&
                <div className="text-right mb-3">
                    <button data-toggle="modal" data-target={`#announcement_cu_info_0`} onClick={() => {
                        setIsModalOpen('YES');
                        setModalOpenId(0);
                        setModalIndex(0);
                        setModalData(null);
                    }} className="btn btn-success btn-sm elevation-1">
                        <i className="fas fa-paper-plane mr-1"></i> Upload Feed
                    </button>
                </div>
            }

            {
                modalIndex === 0 &&
                <ModalCUAnnouncement
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={'Create News Feed'}
                    callbackFunction={(e) => {
                        GetAnnouncements(false);
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                    canMessage='1'
                />
            }

            {
                modalIndex === 1 &&
                <ModalAnnouncement
                    data={modalData}
                    id={modalOpenId}
                    modalTitle={`View News Feed`}
                    callbackFunction={(e) => {
                        GetAnnouncements(false);
                        setIsModalOpen('NO');
                        setModalData(null);
                        setModalIndex(null);
                    }}
                    canMessage={true}
                />
            }

            {
                announcements.length > 0 ? (
                    <>
                        <FormControl fullWidth size='small' className='mb-3' variant="outlined">
                            <InputLabel htmlFor="searchText">Search</InputLabel>
                            <OutlinedInput
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                id="searchText"
                                type="search"
                                label="Search"
                            />
                        </FormControl>

                        {
                            filteredNewsFeed.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((a, index) => {
                                const charLimit = 220;
                                const isLong = a.content?.length > charLimit;
                                const previewText = isLong
                                    ? a.content.substring(0, charLimit) + "..."
                                    : a.content;
                                const readingTime = Math.ceil((a.content?.split(' ').length || 0) / 200);

                                return (
                                    <div key={index} className="news-feed-item mb-4 bg-white shadow-sm border-0 position-relative"
                                        style={{ borderRadius: '15px', transition: 'transform 0.2s ease-in-out' }}>

                                        {/* <div style={{ height: '4px', width: '100%', backgroundColor: '#28a745', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', opacity: 0.8 }}></div> */}

                                        <div className="p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-light px-3 py-1 rounded-pill d-flex align-items-center" style={{ border: '1px solid #e9ecef' }}>
                                                    <i className="far fa-newspaper text-success mr-2" style={{ fontSize: '12px' }}></i>
                                                    <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '0.8px' }}>
                                                        Latest Update
                                                    </span>
                                                </div>
                                                <span className="mx-2 text-muted" style={{ opacity: 0.5 }}>•</span>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>
                                                    {formatDateToReadable(a.created_at, true)}
                                                </div>
                                            </div>

                                            <h2 className="h4 fw-bold text-dark mb-3" style={{ lineHeight: '1.4', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setIsModalOpen('YES');
                                                    setModalOpenId(a.id);
                                                    setModalIndex(1);
                                                    setModalData(a);
                                                }}>
                                                {a.title}
                                            </h2>

                                            <div className="text-secondary mb-4" style={{ fontSize: '15px', lineHeight: '1.7', color: '#4a5568' }}>
                                                {previewText}
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: '#f8f9fa' }}>
                                                <div className="d-flex align-items-center text-muted" style={{ fontSize: '12px' }}>
                                                    <i className="far fa-clock mr-1"></i> {readingTime} min read
                                                </div>

                                                <button
                                                    className="btn btn-link p-0 text-success fw-bold text-decoration-none d-flex align-items-center group"
                                                    style={{ fontSize: '14px' }}
                                                    data-toggle="modal"
                                                    data-target={`#announcement_info_${a.id}`}
                                                    onClick={() => {
                                                        setIsModalOpen('YES');
                                                        setModalOpenId(a.id);
                                                        setModalIndex(1);
                                                        setModalData(a);
                                                    }}
                                                >
                                                    Continue Reading
                                                    <i className="fas fa-chevron-right ml-2" style={{ fontSize: '10px', transition: 'margin-left 0.2s' }}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }

                        <TablePaginationTemplate
                            dataset={filteredNewsFeed}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[12, 24, 36, 50]}
                            page={page}
                            labelRowsPerPage={"News Feeds per page:"}
                            callbackFunction={(e) => {
                                setRowsPerPage(e.rows);
                                setPage(e.page);
                            }}
                        />
                    </>
                ) : (
                    <div className="py-5 px-4 text-center d-flex flex-column align-items-center justify-content-center border rounded bg-white shadow-sm"
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

                        <h4 className="fw-bold text-dark mb-2">No News Feeds Yet</h4>
                        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '350px', fontSize: '14px', lineHeight: '1.6' }}>
                            Check back soon for the latest news, events, and important updates from the other alumni.
                        </p>

                        <div className="text-uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '1px', color: '#adb5bd' }}>
                            <i className="fas fa-info-circle me-1"></i> Stay Tuned
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default NewsFeed