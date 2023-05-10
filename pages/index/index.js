
const jwtToken = localStorage.getItem('jwtToken');
window.addEventListener("load", function(){
    if (jwtToken){
        document.querySelector('.signup-btn').remove();
        document.querySelector('.login-btn').remove();
    }
    else {
        document.querySelector('.dashboard-btn').remove();
    }
    const page = document.querySelector('.page');
    page.classList.remove('hidden');
});