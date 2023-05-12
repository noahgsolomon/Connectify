
const jwtToken = localStorage.getItem('jwtToken');
let expiryDate = new Date(localStorage.getItem('expiry'));
window.addEventListener("load", function(){
    if (jwtToken && expiryDate > new Date()){
        document.querySelector('.signup-btn').remove();
        document.querySelector('.login-btn').remove();
    }
    else {
        document.querySelector('.dashboard-btn').remove();
    }
    const page = document.querySelector('.page');
    page.classList.remove('hidden');
});