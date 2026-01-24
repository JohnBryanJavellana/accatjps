import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import useGetToken from '../../../../hooks/useGetToken';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import DownloadReport from '../../components/DownloadReport';

const AlReport = () => {
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
            const response = await axios.get(`${url}/authenticated/job-seeker/report/`, {
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
    };

    const statusPieData = reportData ? Object.entries(reportData.status_distribution).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value: value
    })) : [];

    const totalApplications = statusPieData.reduce((acc, curr) => acc + curr.value, 0);

    const barChartData = reportData ? reportData.top_performing_posts.map(item => ({
        name: item.title.length > 20 ? item.title.substring(0, 20) + "..." : item.title,
        applicants: item.applicants
    })) : [];

    return (
        <div className="container-fluid p-3" ref={reportRef}>
            {isFetching ? (
                <SkeletonLoader onViewMode={'update'} />
            ) : reportData ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        Alumni Dashboard
                        <DownloadReport ref={reportRef} />
                    </div>

                    <div ref={reportRef}>
                        <div className="row">
                            {[
                                { label: 'Jobs Applied', value: reportData.summary.total_job_posts, icon: 'fa-paper-plane', color: 'bg-info' },
                                { label: 'Interviews', value: reportData.summary.total_applications_received, icon: 'fa-calendar-check', color: 'bg-success' },
                                { label: 'Messages', value: reportData.summary.total_chat_interactions, icon: 'fa-comments', color: 'bg-warning' },
                                { label: 'Success Rate', value: reportData.summary.hiring_rate, icon: 'fa-trophy', color: 'bg-danger' }
                            ].map((stat, i) => (
                                <div className="col-12 col-sm-6 col-md-3" key={i}>
                                    <div className="info-box shadow-sm border-0">
                                        <span className={`info-box-icon ${stat.color} elevation-1`}>
                                            <i className={`fas ${stat.icon} text-white`}></i>
                                        </span>
                                        <div className="info-box-content">
                                            <span className="info-box-text text-muted text-uppercase small font-weight-bold">{stat.label}</span>
                                            <span className="info-box-number h4 mb-0">{stat.value}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-5">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-header bg-transparent text-sm border border-light">
                                        Application Status
                                    </div>
                                    <div className="card-body">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                {totalApplications === 0 ? (
                                                    <Pie
                                                        data={[{ value: 1 }]}
                                                        cx="50%" cy="50%"
                                                        outerRadius={100}
                                                        fill="#f8f9fa"
                                                        stroke="#e9ecef"
                                                        dataKey="value"
                                                        isAnimationActive={false}
                                                    />
                                                ) : (
                                                    <Pie
                                                        data={statusPieData}
                                                        cx="50%" cy="50%"
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
                                                {totalApplications === 0 && (
                                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#6c757d" style={{ fontSize: '14px' }}>
                                                        No Applications
                                                    </text>
                                                )}
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-7">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-header bg-transparent text-sm border border-light">
                                        Job Competition Level
                                    </div>
                                    <div className="card-body">
                                        <p className="small text-muted mb-4">Total applicants for your 5 most recent job applications.</p>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart layout="vertical" data={barChartData} margin={{ left: 30, right: 50 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} stroke="#6c757d" />
                                                <RechartsTooltip cursor={{ fill: '#f8f9fa' }} />
                                                <Bar dataKey="applicants" fill="#6f42c1" radius={[0, 4, 4, 0]} barSize={20}>
                                                    <LabelList dataKey="applicants" position="right" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#6c757d' }} />
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
                <div className="alert alert-light text-center shadow-sm py-5 mt-4">
                    <i className="fas fa-info-circle fa-2x text-muted mb-3"></i>
                    <p className="mb-0 text-muted font-weight-bold">No report data generated yet. Start applying to see your stats!</p>
                </div>
            )}
        </div>
    );
};

export default AlReport;