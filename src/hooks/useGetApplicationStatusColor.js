import React from 'react'

const useGetApplicationStatusColor = () => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'HIRED':
                return 'success';
            case 'REJECTED':
                return 'error';
            case 'PENDING':
                return 'warning';
            case 'INTERVIEW':
                return 'warning';
            case 'IN REVIEW':
                return 'primary';
            case 'WITHDRAWN':
                return 'error';
            case 'FINISHED':
                return 'default';
            default:
                return 'default';
        }
    };

    return { getStatusColor };
}

export default useGetApplicationStatusColor