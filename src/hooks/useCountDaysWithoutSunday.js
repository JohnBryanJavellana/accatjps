import dayjs from 'dayjs';

const useCountDaysWithoutSunday = () => {
    const countDays = (fromDate, toDate, excludeDays = [0]) => {
        const from = dayjs(fromDate);
        const to = dayjs(toDate);
        let count = 0;

        for (let date = from; date.isBefore(to) || date.isSame(to); date = date.add(1, 'day')) {
            if (!excludeDays.includes(date.day())) {
                count++;
            }
        }

        return count;
    };

    return { countDays };
};

export default useCountDaysWithoutSunday;