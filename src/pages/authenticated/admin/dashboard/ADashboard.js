import { useEffect, useRef, useState } from 'react'
import useGetToken from '../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../hooks/useSystemURLCon';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import DownloadReport from '../../components/DownloadReport';

const ADashboard = () => {
    const reportRef = useRef();
    const { getToken } = useGetToken();
    const navigate = useNavigate();
    const { url } = useSystemURLCon();
    const [isFetching, setIsFetching] = useState(true);
    const [dashboardData, setDashboardData] = useState([]);
    const COLORS = ['#28a745', '#ffc107', '#dc3545', '#007bff'];

    const alumniStatusData = [
        { name: 'Activated', value: dashboardData?.verificationStats?.alumni?.verified || 0 },
        { name: 'Verification', value: dashboardData?.verificationStats?.alumni?.verification || 0 },
        { name: 'Declined', value: dashboardData?.verificationStats?.alumni?.declined || 0 },
    ].filter(item => item.value > 0);

    const employerStatusData = [
        { name: 'Activated', value: dashboardData?.verificationStats?.employers?.verified || 0 },
        { name: 'Verification', value: dashboardData?.verificationStats?.employers?.verification || 0 },
        { name: 'Declined', value: dashboardData?.verificationStats?.employers?.declined || 0 },
    ].filter(item => item.value > 0);

    const employmentData = [
        { name: 'Employed', value: dashboardData?.employmentStats?.employed || 0 },
        { name: 'Unemployed', value: dashboardData?.employmentStats?.unemployed || 0 }
    ].filter(item => item.value > 0);

    useEffect(() => {
        GetDashboardData(true);
        return () => { };
    }, []);

    const GetDashboardData = async (isInitialLoad) => {
        try {
            setIsFetching(isInitialLoad);

            const token = getToken('access_token');
            const response = await axios.get(`${url}/authenticated/administrator/dashboard/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log(response.data.dashboardData);
            setDashboardData(response.data.dashboardData);
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            setIsFetching(false);
        }
    }

    const totalEmployment = (employmentData || []).reduce((acc, curr) => acc + curr.value, 0);
    const totalEmployerVerification = employerStatusData.reduce((acc, curr) => acc + curr.value, 0);
    const totalAlumniVerification = alumniStatusData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <>
            {
                isFetching
                    ? <SkeletonLoader onViewMode={'update'} />
                    : <>
                        <div className="container-fluid">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h1 className="h4 m-0">Administrator Dashboard</h1>
                                <DownloadReport ref={reportRef} />
                            </div>

                            <div ref={reportRef}>
                                <div className="row">
                                    <div className="col-lg-3 col-6">
                                        <div className="small-box bg-info elevation-2">
                                            <div className="inner">
                                                <h3>{dashboardData?.summary?.totalUsers || 0}</h3>
                                                <p>Total Registered Users</p>
                                            </div>
                                            <div className="icon"><i className="fas fa-users"></i></div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3 col-6">
                                        <div className="small-box bg-success elevation-2">
                                            <div className="inner">
                                                <h3>{dashboardData?.summary?.totalAlumni || 0}</h3>
                                                <p>Total Alumni</p>
                                            </div>
                                            <div className="icon"><i className="fas fa-user-graduate"></i></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-6">
                                        <div className="small-box bg-primary elevation-2">
                                            <div className="inner">
                                                <h3>{dashboardData?.summary?.totalEmployers || 0}</h3>
                                                <p>Total Employers</p>
                                            </div>
                                            <div className="icon"><i className="fas fa-building"></i></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-6">
                                        <div className="small-box bg-secondary elevation-2">
                                            <div className="inner">
                                                <h3>{dashboardData?.summary?.totalJobPosts || 0}</h3>
                                                <p>Total Job Posts</p>
                                            </div>
                                            <div className="icon"><i className="fas fa-briefcase"></i></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="card shadow-sm">
                                            <div className="card-header border border-light text-sm bg-white">
                                                Alumni Distribution by Course
                                            </div>
                                            <div className="card-body">
                                                <div style={{ width: '100%', height: 300 }}>
                                                    <ResponsiveContainer>
                                                        <BarChart data={dashboardData?.alumniDetails?.byCourse || []}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                                                            <XAxis dataKey="course__course_name" />
                                                            <YAxis allowDecimals={false} />
                                                            <Tooltip
                                                                cursor={{ fill: '#f8f9fa' }}
                                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                                            />
                                                            <Bar dataKey="count" fill="#28a745" radius={[4, 4, 0, 0]} barSize={40} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="card shadow-sm">
                                            <div className="card-header border border-light text-sm bg-white text-center">
                                                Alumni Verification
                                            </div>
                                            <div className="card-body">
                                                <div style={{ width: '100%', height: 300 }}>
                                                    <ResponsiveContainer>
                                                        <PieChart>
                                                            {totalAlumniVerification === 0 ? (
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
                                                                    data={alumniStatusData}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={100}
                                                                    dataKey="value"
                                                                    nameKey="name"
                                                                >
                                                                    {alumniStatusData.map((entry, index) => (
                                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                    ))}
                                                                </Pie>
                                                            )}

                                                            <Tooltip enabled={totalAlumniVerification > 0} />
                                                            <Legend verticalAlign="bottom" iconType="circle" />

                                                            {totalAlumniVerification === 0 && (
                                                                <text
                                                                    x="50%"
                                                                    y="50%"
                                                                    textAnchor="middle"
                                                                    dominantBaseline="middle"
                                                                    style={{ fill: '#6c757d', fontSize: '14px', fontWeight: '400' }}
                                                                >
                                                                    No Alumni Data
                                                                </text>
                                                            )}
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="card shadow-sm">
                                            <div className="card-header border border-light text-sm bg-white">
                                                Graduation Year Statistics
                                            </div>
                                            <div className="card-body">
                                                <div style={{ width: '100%', height: 250 }}>
                                                    <ResponsiveContainer>
                                                        <BarChart data={dashboardData?.alumniDetails?.byBatch || []}>
                                                            <XAxis dataKey="year_graduated" />
                                                            <YAxis allowDecimals={false} />
                                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                                            <Bar dataKey="count" fill="#17a2b8" radius={[4, 4, 0, 0]} barSize={50} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="card shadow-sm">
                                            <div className="card-header border border-light text-sm bg-white text-center">
                                                Employer Verification
                                            </div>
                                            <div className="card-body">
                                                <div style={{ width: '100%', height: 250 }}>
                                                    <ResponsiveContainer>
                                                        <PieChart>
                                                            {totalEmployerVerification === 0 ? (
                                                                <Pie
                                                                    data={[{ value: 1 }]}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={100}
                                                                    fill="#f0f0f0"
                                                                    stroke="#e0e0e0"
                                                                    dataKey="value"
                                                                    isAnimationActive={false}
                                                                />
                                                            ) : (
                                                                // Real Data
                                                                <Pie
                                                                    data={employerStatusData}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={100}
                                                                    paddingAngle={0}
                                                                    dataKey="value"
                                                                    nameKey="name"
                                                                >
                                                                    {employerStatusData.map((entry, index) => (
                                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                    ))}
                                                                </Pie>
                                                            )}

                                                            <Tooltip enabled={totalEmployerVerification > 0} />
                                                            <Legend verticalAlign="bottom" iconType="circle" />

                                                            {totalEmployerVerification === 0 && (
                                                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fill: '#adb5bd', fontSize: '12px', fontWeight: '500' }}>
                                                                    NO DATA
                                                                </text>
                                                            )}
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="card shadow-sm">
                                            <div className="card-header bg-white border border-light text-sm">
                                                Employers by Industry/Type
                                            </div>
                                            <div className="card-body">
                                                <div style={{ width: '100%', height: 250 }}>
                                                    <ResponsiveContainer>
                                                        <BarChart data={dashboardData?.employerTypes || []}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                            <XAxis dataKey="business_type" fontSize={12} />
                                                            <YAxis allowDecimals={false} />
                                                            <Tooltip cursor={{ fill: '#f8f9fa' }} />
                                                            <Bar dataKey="count" fill="#007bff" radius={[4, 4, 0, 0]} barSize={50} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="card shadow-sm">
                                            <div className="card-header bg-white border border-light text-center text-sm">
                                                Alumni Employment Status
                                            </div>
                                            <div className="card-body">
                                                <div style={{ width: '100%', height: 250 }}>
                                                    <ResponsiveContainer>
                                                        <PieChart>
                                                            {totalEmployment === 0 ? (
                                                                <Pie
                                                                    data={[{ value: 1 }]}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={100}
                                                                    fill="#f0f0f0"
                                                                    stroke="#e0e0e0"
                                                                    dataKey="value"
                                                                    isAnimationActive={false}
                                                                />
                                                            ) : (
                                                                <Pie
                                                                    data={employmentData}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={100}
                                                                    dataKey="value"
                                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                                >
                                                                    <Cell fill="#28a745" />
                                                                    <Cell fill="#dc3545" />
                                                                </Pie>
                                                            )}
                                                            <Tooltip enabled={totalEmployment > 0} />
                                                            {totalEmployment === 0 && (
                                                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-muted" style={{ fontSize: '12px' }}>
                                                                    No Data
                                                                </text>
                                                            )}
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default ADashboard;