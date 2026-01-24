import { Box, Skeleton } from '@mui/material';
import './SkeletonLoader.css';

const SkeletonLoader = ({ onViewMode, className = '' }) => {
    return (
        <>
            <section className={`content ${className}`}>
                <div className="container-fluid pr-0">
                    <div className="row w-100">
                        <div className="col-xl-12 p-0">
                            <div className={`card w-100 ${onViewMode === 'update' && 'm-0 elevation-0'}`}>
                                <div className='card-body'>
                                    <Box>
                                        <Skeleton className='skeletonLoader' animation="pulse" />
                                        <Skeleton className='skeletonLoader' animation="pulse" />
                                        <Skeleton className='skeletonLoader' animation="pulse" />
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SkeletonLoader;