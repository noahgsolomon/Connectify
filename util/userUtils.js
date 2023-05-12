import {deleteAllNotifications, getNotifications} from "./api/notificationapi.js";

const notificationRender = async () => {
    const notificationList = await getNotifications();
    console.log(notificationList);
    notificationList.reverse();
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationList.length > 0){
        notificationBtn.style.backgroundColor = '#ff6a5f';
    }
    const notificationItems = document.querySelector('.notification-items');
    notificationItems.innerHTML = '';
    if (notificationList.length === 0){
        notificationBtn.style.backgroundColor = '#f5f5f5';
    }
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
        notificationContent.textContent = `${notification.sender} ${notification.content}`
        const notificationTimestamp = document.createElement('div');
        notificationTimestamp.className = 'notification-timestamp';
        const dateObject = new Date(notification.date);
        notificationTimestamp.textContent = timeAgo(dateObject);

        notificationItem.append(notificationTitle);
        notificationItem.append(notificationContent);
        notificationItem.append(notificationTimestamp);
        notificationItems.append(notificationItem);
    }
    if (notificationList.length === 0){
        const noNotificationsItem = document.createElement('div');
        noNotificationsItem.className = 'no-notifications-item';
        noNotificationsItem.textContent = '📭 No new notifications';
        noNotificationsItem.style.fontWeight = 'bold';
        notificationItems.append(noNotificationsItem);
    }
}

function timeAgo(date) {
    console.log(date)
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