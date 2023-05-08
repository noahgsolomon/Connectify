import {getNotifications, deleteAllNotifications} from "./api/userapi.js";

const notificationRender = async () => {
    const notificationList = await getNotifications();
    notificationList.reverse();
    const notificationItems = document.querySelector('.notification-items');
    for (const notification of notificationList){
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        const notificationTitle = document.createElement('div');
        notificationTitle.className = 'notification-title';
        if (notification.type === 'LIKE'){
            notificationTitle.textContent = 'New Like ❤️';
        } else if (notification.type === 'FOLLOW'){
            notificationTitle.textContent = 'New Follower 👥';
        }else if (notification.type === 'COMMENT'){
            notificationTitle.textContent = 'New Comment 💬';
        }else if (notification.type === 'TAG'){
            notificationTitle.textContent = 'New Tag 🏷️';
        }else if (notification.type === 'MESSAGE'){
            notificationTitle.textContent = 'New Message 📩';
        }
        const notificationContent = document.createElement('div');
        notificationContent.className = 'notification-content';
        console.log(notification.sender);
        notificationContent.textContent = `${notification.sender} ${notification.content}`
        const notificationTimestamp = document.createElement('div');
        notificationTimestamp.className = 'notification-timestamp';
        notificationTimestamp.textContent = timeAgo(notification.time);

        notificationItem.append(notificationTitle);
        notificationItem.append(notificationContent);
        notificationItem.append(notificationTimestamp);
        notificationItems.append(notificationItem);
    }

    document.querySelector('.notification-btn').addEventListener('click', async () => {
        document.querySelector('.notification-panel').classList.toggle('show');
        if (document.querySelector('.notification-panel').classList.contains('show') && notificationList.length > 0){
            await deleteAllNotifications()
        }
    });

    document.querySelector('.page').addEventListener('click', async (event) => {
        const notificationPanel = document.querySelector('.notification-panel');
        const notificationBtn = document.querySelector('.notification-btn');

        if (event.target !== notificationBtn) {
            if (notificationPanel.classList.contains('show')) {
                notificationPanel.classList.toggle('show');
                if (notificationList.length > 0) {
                    await deleteAllNotifications();
                }
            }
        }
    });
}

function timeAgo(date) {
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    if (daysAgo > 0) {
        return `${daysAgo} days ago`;
    } else if (hoursAgo > 0) {
        return `${hoursAgo} hours ago`;
    } else if (minutesAgo > 0) {
        return `${minutesAgo} minutes ago`;
    } else {
        return `Just now`;
    }
}

export {
    notificationRender
}