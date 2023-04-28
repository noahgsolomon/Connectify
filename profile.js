document.addEventListener("DOMContentLoaded", function() {
    const emojiList = ['😀', '😁', '😂', '🤣', '😃', '😄',
        '😅', '😆', '😉', '😊', '😋','😎','😍',
        '😘', '🥰', '😗'];
    const emojiFace = emojiList[Math.round(Math.random() * 15)];


    const profile = async () => {
        try {
            const response = await fetch("http://localhost:8080/profile", {
                method: "GET",
                headers: {"Content-Type":"application/json"},
                credentials: "include"
            });

            const responseBody = await response.text();
            console.log(responseBody);
            console.log(responseBody);
            return responseBody;
        } catch (error){
            console.log(error);
        }
    }

    const updateProfile = async (country, bio) => {
        const model = {
            country: country,
            bio: bio
        }
        try{
            const response = await fetch("http://localhost:8080/profile", {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(model),
                credentials: "include"
            });

            const responseBody = await response.text();
            console.log(responseBody);
            return responseBody;
        }catch (error){
            console.log(error);
        }
    }

    (async () => {
        const profileJson = await profile();
        const userDetails = JSON.parse(profileJson);

        const emoji = document.querySelector('.profile-emoji');
        emoji.textContent = emojiFace;
        const profileName = document.querySelector('.profile-name');
        profileName.textContent = userDetails.username;
        const country = document.querySelector(".profile-country");
        country.textContent = 'Country: ' + userDetails.country;
        const bio = document.querySelector(".profile-bio");
        bio.textContent = userDetails.bio;
        const category = document.querySelector(".profile-category");
        category.textContent = userDetails.topCategory + ' enthusiast';

    })();

    const editButton = document.querySelector('.edit-btn');
    editButton.addEventListener('click', handleEditButtonClick);
    const cancelBtn = document.querySelector('.cancel-btn');

    function handleEditButtonClick() {
        const editForm = document.querySelector('.edit-form');
        const countryInput = document.querySelector('#country');
        const bioInput = document.querySelector('#bio');

        cancelBtn.style.display = 'block';

        editForm.style.display = 'block';

        cancelBtn.addEventListener('click', () =>{
            editForm.style.display = 'none';
            cancelBtn.style.display = 'none';
        });


        // Add an event listener to handle form submission
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedCountry = countryInput.value.trim();
            const updatedBio = bioInput.value.trim();

            const newProfile = await updateProfile(updatedCountry, updatedBio);
            const userDetails = JSON.parse(newProfile);

            const emoji = document.querySelector('.profile-emoji');
            emoji.textContent = emojiFace;
            const profileName = document.querySelector('.profile-name');
            profileName.textContent = userDetails.username;
            const country = document.querySelector(".profile-country");
            country.textContent = 'Country: ' + userDetails.country;
            const bio = document.querySelector(".profile-bio");
            bio.textContent = 'Bio: ' + userDetails.bio;
            const category = document.querySelector(".profile-category");
            category.textContent = userDetails.topCategory + ' enthusiast';


            editForm.style.display = 'none';
            editForm.reset();
            cancelBtn.style.display = 'none';
        });
    }



});