import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
    LabelList
} from 'recharts';
import useGetToken from '../../../hooks/useGetToken';
import useSystemURLCon from '../../../hooks/useSystemURLCon';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';
import DownloadReport from '../components/DownloadReport';

const EReport = () => {
    const reportRef = useRef();
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [reportData, setReportData] = useState(null);

    const COLORS = ['#17a2b8', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#007bff'];

    useEffect(() => {
        GetDashboardData(true);
    }, []);

    const GetDashboardData = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);
            const token = getToken('access_token');
            const response = await axios.get(`${url}/authenticated/employer/report/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportData(response.data.reportData);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    // --- Data Transformation for Recharts ---
    const statusPieData = reportData ? Object.entries(reportData.status_distribution).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value: value
    })) : [];

    const totalApplicants = statusPieData.reduce((acc, curr) => acc + curr.value, 0);

    const barChartData = reportData ? reportData.top_performing_posts.map(job => ({
        name: job.title.length > 15 ? job.title.substring(0, 15) + "..." : job.title,
        applicants: job.applicants
    })) : [];

    return (
        <div className="container-fluid p-3">
            {isFetching ? (
                <SkeletonLoader />
            ) : reportData ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        Employer Dashboard
                        <DownloadReport ref={reportRef} />
                    </div>

                    <div ref={reportRef}>
                        <div className="row">
                            {[
                                { label: 'Total Posts', value: reportData.summary.total_job_posts, icon: 'fa-briefcase', color: 'bg-info' },
                                { label: 'Total Applicants', value: reportData.summary.total_applications_received, icon: 'fa-users', color: 'bg-success' },
                                { label: 'Chat Interactions', value: reportData.summary.total_chat_interactions, icon: 'fa-comments', color: 'bg-warning' },
                                { label: 'Hiring Rate', value: reportData.summary.hiring_rate, icon: 'fa-chart-line', color: 'bg-danger' }
                            ].map((stat, i) => (
                                <div className="col-12 col-sm-6 col-md-3" key={i}>
                                    <div className="info-box shadow-sm">
                                        <span className={`info-box-icon ${stat.color} elevation-1`}>
                                            <i className={`fas ${stat.icon}`}></i>
                                        </span>
                                        <div className="info-box-content">
                                            <span className="info-box-text text-muted">{stat.label}</span>
                                            <span className="info-box-number h5 mb-0">{stat.value}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-5">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-header bg-white text-sm border border-light">
                                        Application Status
                                    </div>
                                    <div className="card-body">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                {totalApplicants === 0 ? (
                                                    <Pie
                                                        data={[{ value: 1 }]}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        fill="#f8f9fa"
                                                        stroke="#e9ecef"
                                                        dataKey="value"
                                                        isAnimationActive={false}
                                                    />
                                                ) : (
                                                    <Pie
                                                        data={statusPieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={100}
                                                        dataKey="value"
                                                    >
                                                        {statusPieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                )}
                                                <RechartsTooltip />
                                                <Legend verticalAlign="bottom" iconType="circle" />
                                                {totalApplicants === 0 && (
                                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#6c757d">
                                                        No Data
                                                    </text>
                                                )}
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-7">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-header bg-white text-sm border border-light">
                                        Applicants per Job Post
                                    </div>
                                    <div className="card-body">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart layout="vertical" data={barChartData} margin={{ left: 20, right: 40 }}> {/* Increased right margin for label space */}
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={100}
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#6c757d"
                                                />
                                                <RechartsTooltip cursor={{ fill: '#f8f9fa' }} />
                                                <Bar
                                                    dataKey="applicants"
                                                    fill="#007bff"
                                                    radius={[0, 4, 4, 0]}
                                                    barSize={25}
                                                >
                                                    <LabelList
                                                        dataKey="applicants"
                                                        position="right"
                                                        style={{ fill: '#6c757d', fontSize: '12px', fontWeight: 'bold' }}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center mt-5 py-5 bg-white shadow-sm rounded">
                    <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No report data found for this account.</p>
                </div>
            )}
        </div>
    );
};

export default EReport;