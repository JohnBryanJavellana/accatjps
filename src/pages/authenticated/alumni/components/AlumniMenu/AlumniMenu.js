import React, { useEffect, useState } from 'react';
import './AlumniMenu.css';
import { AppBar, Toolbar, Typography, Box, Stack, Button, useMediaQuery, useTheme, Menu, MenuItem, Collapse } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Facebook, YouTube, Email, Dehaze } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import useGetCurrentUser from '../../../../../hooks/useGetCurrentUser';
import useShowSubmitLoader from '../../../../../hooks/useShowSubmitLoader';
import WelcomeGreeting from '../../../components/WelcomeGreeting';
import useGetToken from '../../../../../hooks/useGetToken';
import axios from 'axios';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import LogoutButton from '../../../components/LogoutButton/LogoutButton';
import CustomNotification from '../../../components/CustomNotification/CustomNotification';

const AlumniMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const isTouch = useMediaQuery('(pointer: coarse)');
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
    const [isFetchingCurrentUser, setIsFetchingCurrentUser] = useState(true);
    const [isProcessingLogout, setIsProcessingLogout] = useState(true);
    const { setShowLoader, SubmitLoadingAnim, setProgress, setMethod } = useShowSubmitLoader();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const { userData, refreshUser } = useGetCurrentUser();
    const { url } = useSystemURLCon();
    const { getToken, removeToken } = useGetToken();

    const getButtonStyle = (path) => ({
        color: 'inherit',
        textTransform: 'none',
        fontWeight: 'bold',
        backgroundColor: isActive(path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        borderRadius: 0,
        height: '64px',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }
    });

    const navItems = [
        { label: 'Home', path: '/welcome/alumni/' },
        { label: 'Report', path: '/welcome/report/' },
        { label: 'News Feed', path: '/welcome/news-feed/' },
        { label: 'Jobs', path: '/welcome/alumni/jobs' },
        { label: 'Info Board', path: '/welcome/alumni/info-board' },
        { label: 'Gallery', path: '/welcome/alumni/gallery' },
        { label: 'About Us', path: '/welcome/alumni/about' },
        { label: 'Manage Profile', path: '/welcome/alumni/manage-account' }
    ];

    useEffect(() => {
        setShowLoader(true);

        if (userData !== null) {
            setShowLoader(false);
            setIsFetchingCurrentUser(false);
        }
    }, [userData]);

    return (
        <>
            {
                (isFetchingCurrentUser || isProcessingLogout) &&
                <SubmitLoadingAnim cls={(isFetchingCurrentUser) ? 'loader2' : 'loader'} place='OUT' />
            }

            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" elevation={0} color='success' sx={{
                    borderBottom: '1px solid #2c6942',
                    zIndex: (theme) => theme.zIndex.appBar
                }}>
                    <div className="container">
                        <Toolbar disableGutters>
                            {
                                isTouch || isMobileView
                                    ? <div className='mx-1' style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                            <Box
                                                component="img"
                                                className='my-2'
                                                src="/system-images/philippines-logo.png"
                                                sx={{ height: 50 }}
                                            />
                                        </Box>

                                        <Box sx={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                        }}>
                                            <CustomNotification limit={3} />

                                            <IconButton color="inherit" onClick={toggleMenu}>
                                                <Dehaze fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </div> : <>
                                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                            <Box
                                                component="img"
                                                src="/system-images/philippines-logo.png"
                                                sx={{ height: 50 }}
                                            />
                                        </Box>

                                        <Box>
                                            <Stack direction="row" spacing={2}>
                                                {navItems.map((item) => {
                                                    return <Button
                                                        key={item.label}
                                                        onClick={() => navigate(item.path)}
                                                        sx={getButtonStyle(item.path)}
                                                    >
                                                        {item.label}
                                                    </Button>
                                                })}
                                            </Stack>
                                        </Box>

                                        <Box sx={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                        }}>
                                            <Stack direction="row" spacing={0.5}>
                                                <CustomNotification limit={3} />

                                                <IconButton color="inherit" href="https://facebook.com" target="_blank" sx={{ '&:hover': { color: '#1877F2' } }}>
                                                    <Facebook fontSize="small" />
                                                </IconButton>
                                                <IconButton color="inherit" href="https://youtube.com" target="_blank" sx={{ '&:hover': { color: '#FF0000' } }}>
                                                    <YouTube fontSize="small" />
                                                </IconButton>
                                                <IconButton color="inherit" href="mailto:your@email.com" sx={{ '&:hover': { color: '#EA4335' } }}>
                                                    <Email fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </Box>
                                    </>
                            }
                        </Toolbar>
                    </div>
                </AppBar>
            </Box>

            {
                (isMobileView || isTouch) &&
                <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                    <Box sx={{
                        position: 'fixed',
                        top: '65px', // Matches your first AppBar height
                        left: 0,
                        right: 0,
                        bgcolor: '#2e7d32',
                        zIndex: 1000,
                        borderBottom: '5px solid #D6A73D',
                        boxShadow: 3
                    }}>
                        <Stack spacing={0}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                                    sx={{
                                        ...getButtonStyle(item.path),
                                        color: 'white',
                                        py: 2,
                                        borderRadius: 0,
                                        borderBottom: '1px solid #2c6942',
                                        '&:hover': { bgcolor: '#1b5e20' }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                                <IconButton color="inherit" href="https://facebook.com" target="_blank" sx={{ '&:hover': { color: '#1877F2' } }}>
                                    <Facebook fontSize="small" />
                                </IconButton>
                                <IconButton color="inherit" href="https://youtube.com" target="_blank" sx={{ '&:hover': { color: '#FF0000' } }}>
                                    <YouTube fontSize="small" />
                                </IconButton>
                                <IconButton color="inherit" href="mailto:your@email.com" sx={{ '&:hover': { color: '#EA4335' } }}>
                                    <Email fontSize="small" />
                                </IconButton>
                            </Box>
                        </Stack>
                    </Box>
                </Collapse>
            }

            <AppBar position="static" elevation={0} color='success' style={{ borderBottom: '5px solid #D6A73D', marginTop: '65px' }}>
                <div className={`container my-3`}>
                    {
                        isTouch || isMobileView
                            ? <div className='text-center' style={{ width: '100%' }}>
                                <img src='/system-images/logo.png' height={70} alt="Logo" />
                                <div style={{
                                    lineHeight: '1.2',
                                    fontFamily: 'Sedan',
                                    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)',
                                    marginTop: '10px'
                                }}>
                                    <h5 style={{ fontSize: '1.2rem', margin: 0 }}>
                                        Abuyog Community College Alumni Association
                                    </h5>
                                </div>

                                <div className='text-center pt-2'>
                                    <WelcomeGreeting className='text-sm' name={userData?.first_name} />
                                    <div className='text-sm'>{String(userData?.role).toUpperCase()}</div>
                                    <div>
                                        <LogoutButton />
                                    </div>
                                </div>
                            </div>
                            : <div className='row'>
                                <div className='col-xl-6 d-flex align-items-center'>
                                    <img src='/system-images/logo.png' height={90} className='mr-5' alt="Logo" />
                                    <div style={{ lineHeight: '1', fontFamily: 'Sedan', textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)', fontSize: '40px' }}>
                                        <h2 style={{ margin: 0 }}>Abuyog Community College</h2>
                                        <h2 style={{ margin: 0 }}>Alumni Association</h2>
                                    </div>
                                </div>

                                <div className='col-xl-6 text-right pt-2'>
                                    <WelcomeGreeting className={'text-sm'} name={userData?.first_name} />
                                    <div className='text-sm'>{String(userData?.role).toUpperCase()}</div>
                                    <div>
                                        <LogoutButton />
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </AppBar>

            <Box component="main">
                <div className="container py-4">
                    <Outlet />
                </div>
            </Box>
        </>
    );
}

export default AlumniMenu;