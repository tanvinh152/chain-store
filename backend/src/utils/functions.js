const getFirstLastDateInWeek = () => {
    const curr = new Date(); // get current date
    const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6

    const firstDay = new Date(curr.setDate(first)).toUTCString();
    const lastDay = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

    return { firstDay, lastDay };
};

module.exports = {
    getFirstLastDateInWeek,
};
