import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';

const useDateFormat = () => {
    const formatDateToReadable = (date, showTime = false) => {
        if (!date) return "";
        
        try {
            return format(
                parseISO(date),
                `MMMM d, yyyy${showTime ? ' hh:mm a' : ''}`
            );
        } catch {
            return date;
        }
    };

    const countDays = (from, to, suffix = '', calendarDays = false) => {
        const fromDate = dayjs(from);
        let toDate = dayjs(to);
        toDate = calendarDays ? toDate.add(1, 'day') : toDate;
        const count = toDate.diff(fromDate, 'day'); 

        return `(${ count > 0 ? count : 1 } day${ count > 1 ? 's' : '' }${suffix})`;
    }

    const calculateAge = (date) => {
        if (!date) return "";
        
        const birthDate = new Date(date);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    return { formatDateToReadable, calculateAge, countDays };
}

export default useDateFormat