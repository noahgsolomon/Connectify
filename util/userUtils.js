import {getNotifications} from "./api/notificationapi.js";

const notificationRender = async () => {
    const notificationList = await getNotifications();
    notificationList.reverse();
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationList.length > 0){
        notificationBtn.classList.add('has-notification');
    }
    const notificationItems = document.querySelector('.notification-items');
    notificationItems.innerHTML = '';
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

function applyTheme() {
    const theme = localStorage.getItem('theme');
    const root = document.documentElement;

    if (theme === 'light') {
        root.style.setProperty('--header', 'var(--light-header)');
        root.style.setProperty('--header-btn', 'var(--light-header-btn)');
        root.style.setProperty('--emoji', 'var(--light-emoji)');
        root.style.setProperty('--detail-color', 'var(--light-detail-color)');
        root.style.setProperty('--background', 'var(--light-background)');
        root.style.setProperty('--logo', 'var(--light-logo)');
        root.style.setProperty('--liked-btn-bg', 'var(--light-liked-btn-bg)');
        root.style.setProperty('--bookmarked-btn-bg', 'var(--light-bookmarked-btn-bg)');
        root.style.setProperty('--input-bg', 'var(--light-input-bg)');
        root.style.setProperty('--text-color', 'var(--light-text-color)');
        root.style.setProperty('--post-title-color', 'var(--light-post-title-color)');
        root.style.setProperty('--post-text-color', 'var(--light-post-text-color)');
        root.style.setProperty('--post-meta-color', 'var(--light-post-meta-color)');
        root.style.setProperty('--post-meta-date-color', 'var(--light-post-meta-date-color)');
        root.style.setProperty('--post-highlight-color', 'var(--light-post-highlight-color)');
        root.style.setProperty('--post-highlight-text-shadow', 'var(--light-post-highlight-text-shadow)');
        root.style.setProperty('--add-post-btn-bg', 'var(--light-add-post-btn-bg)');
        root.style.setProperty('--post-search-bg', 'var(--light-post-search-bg)');
        root.style.setProperty('--modal-bg', 'var(--light-modal-bg)');
        root.style.setProperty('--postForm-input-bg', 'var(--light-postForm-input-bg)');
        root.style.setProperty('--postForm-submit-btn-bg', 'var(--light-postForm-submit-btn-bg)');
        root.style.setProperty('--slide-message-bg', 'var(--light-slide-message-bg)');
        root.style.setProperty('--inbox-panel-bg', 'var(--light-inbox-panel-bg)');
        root.style.setProperty('--inbox-search-bg', 'var(--light-inbox-search-bg)');
        root.style.setProperty('--overlay-bg', 'var(--light-overlay-bg)');
        root.style.setProperty('--btn-hover', 'var(--light-btn-hover)');
        root.style.setProperty('--btn-focus', 'var(--light-btn-focus)');
        root.style.setProperty('--input-hover', 'var(--light-input-hover)');
        root.style.setProperty('--input-focus', 'var(--light-input-focus)');
        root.style.setProperty('--highlight-color', 'var(--highlight-color-light)');
        root.style.setProperty('--shadow', 'var(--shadow-light)');
        root.style.setProperty('--border-color', 'var(--border-color-light)');
        root.style.setProperty('--btn-color', 'var(--btn-color-light)');
        root.style.setProperty('--error-color', 'var(--error-color-light)');
        root.style.setProperty('--error-color-hover', 'var(--error-color-hover-light)');
        root.style.setProperty('--light-tile', 'var(--light-tile-light');
        root.style.setProperty('--dark-tile', 'var(--dark-tile-light');
        root.style.setProperty('--chess-border', 'var(--chess-border-light');
        root.style.setProperty('--card', 'var(--card-light');

    } else {
        root.style.setProperty('--header', 'var(--dark-header)');
        root.style.setProperty('--header-btn', 'var(--dark-header-btn)');
        root.style.setProperty('--emoji', 'var(--dark-emoji)');
        root.style.setProperty('--detail-color', 'var(--dark-detail-color)');
        root.style.setProperty('--background', 'var(--dark-background)');
        root.style.setProperty('--logo', 'var(--dark-logo)');
        root.style.setProperty('--liked-btn-bg', 'var(--dark-liked-btn-bg)');
        root.style.setProperty('--bookmarked-btn-bg', 'var(--dark-bookmarked-btn-bg)');
        root.style.setProperty('--input-bg', 'var(--dark-input-bg)');
        root.style.setProperty('--text-color', 'var(--dark-text-color)');
        root.style.setProperty('--post-title-color', 'var(--dark-post-title-color)');
        root.style.setProperty('--post-text-color', 'var(--dark-post-text-color)');
        root.style.setProperty('--post-meta-color', 'var(--dark-post-meta-color)');
        root.style.setProperty('--post-meta-date-color', 'var(--dark-post-meta-date-color)');
        root.style.setProperty('--post-highlight-color', 'var(--dark-post-highlight-color)');
        root.style.setProperty('--post-highlight-text-shadow', 'var(--dark-post-highlight-text-shadow)');
        root.style.setProperty('--add-post-btn-bg', 'var(--dark-add-post-btn-bg)');
        root.style.setProperty('--post-search-bg', 'var(--dark-post-search-bg)');
        root.style.setProperty('--modal-bg', 'var(--dark-modal-bg)');
        root.style.setProperty('--postForm-input-bg', 'var(--dark-postForm-input-bg)');
        root.style.setProperty('--postForm-submit-btn-bg', 'var(--dark-postForm-submit-btn-bg)');
        root.style.setProperty('--slide-message-bg', 'var(--dark-slide-message-bg)');
        root.style.setProperty('--inbox-panel-bg', 'var(--dark-inbox-panel-bg)');
        root.style.setProperty('--inbox-search-bg', 'var(--dark-inbox-search-bg)');
        root.style.setProperty('--overlay-bg', 'var(--dark-overlay-bg)');
        root.style.setProperty('--btn-hover', 'var(--dark-btn-hover)');
        root.style.setProperty('--btn-focus', 'var(--dark-btn-focus)');
        root.style.setProperty('--input-hover', 'var(--dark-input-hover)');
        root.style.setProperty('--input-focus', 'var(--dark-input-focus)');
        root.style.setProperty('--highlight-color', 'var(--highlight-color-dark)');
        root.style.setProperty('--shadow', 'var(--shadow-dark)');
        root.style.setProperty('--border-color', 'var(--border-color-dark)');
        root.style.setProperty('--btn-color', 'var(--btn-color-dark)');
        root.style.setProperty('--error-color', 'var(--error-color-dark)');
        root.style.setProperty('--error-color-hover', 'var(--error-color-hover-dark)');
        root.style.setProperty('--light-tile', 'var(--light-tile-dark');
        root.style.setProperty('--dark-tile', 'var(--dark-tile-dark');
        root.style.setProperty('--chess-border', 'var(--chess-border-dark');
        root.style.setProperty('--card', 'var(--card-dark');

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
    notificationRender,
    applyTheme
}