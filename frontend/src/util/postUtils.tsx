const formatDateAndTime = (dateString : string) => {
    const dateObj = new Date(dateString);
    const now = new Date();
    const timeDifference = now.getTime() - dateObj.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
    }).replace(/^0+/, '');

    if (timeDifference < twentyFourHours) {
        return `${formattedTime}`;
    } else {
        return `${formattedDate}`;
    }
};

export {
    formatDateAndTime
}