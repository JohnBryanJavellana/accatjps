import React, { useState } from 'react';
import './GuestWrapper.css';
import { AppBar, Toolbar, Typography, Box, Stack, Button, useMediaQuery, useTheme, Menu, MenuItem, Collapse } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Facebook, YouTube, Email, Dehaze } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import DetectMobileViewport from '../../../../hooks/DetectMobileViewport';

const GuestWrapper = ({ authenticated = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobileViewport = DetectMobileViewport();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isActive = (item) => {
        if (item.relatedPaths) {
            return item.relatedPaths.includes(location.pathname);
        }
        return location.pathname === item.path;
    };

    const getButtonStyle = (item) => ({
        color: 'inherit',
        textTransform: 'none',
        fontWeight: 'bold',
        backgroundColor: isActive(item) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        borderRadius: 0,
        height: '64px',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }
    });

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Jobs', path: '/jobs' },
        { label: 'Info Board', path: '/info-board' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'About Us', path: '/about' },
        { label: 'Alumni Login', path: '/alumni/login', relatedPaths: ['/alumni/login', '/alumni/create-account'] },
        { label: 'Employer Login', path: '/employer/login', relatedPaths: ['/employer/login', '/employer/create-account'] }
    ];

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" elevation={0} color='success' style={{ borderBottom: '1px solid #2c6942' }}>
                    <div className="container">
                        <Toolbar disableGutters>
                            {
                                isMobileViewport
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

                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Stack direction="row" spacing={2}>
                                                {navItems.map((item) => {
                                                    return <Button
                                                        key={item.label}
                                                        onClick={() => navigate(item.path)}
                                                        sx={getButtonStyle(item)}
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
                (isMobileViewport) &&
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
                <div className={`container d-flex align-items-center my-3 ${isMobileViewport ? 'justify-content-center' : ''}`}>
                    {
                        isMobileViewport
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
                            </div>
                            : <>
                                <img src='/system-images/logo.png' height={90} className='mr-5' alt="Logo" />
                                <div style={{ lineHeight: '1', fontFamily: 'Sedan', textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)', fontSize: '40px' }}>
                                    <h2 style={{ margin: 0 }}>Abuyog Community College</h2>
                                    <h2 style={{ margin: 0 }}>Alumni Association</h2>
                                </div>
                            </>
                    }
                </div>
            </AppBar>

            <Box component="main" color={'transparent'}>
                <div className="container pt-4">
                    <Outlet />
                </div>
            </Box>
        </>
    );
}

export default GuestWrapper;