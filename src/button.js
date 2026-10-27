// button.js
const buttonContainer = document.getElementById('button');

const base = import.meta.env.BASE_URL;

const logos = {
    linkedIn: `${base}assets/Icons/linkedIn_icon.png`,
    github: `${base}assets/Icons/github_icon.png`,
    blog: `${base}assets/Icons/medium_icon.png`,
    youtube: `${base}assets/Icons/youtube_icon.png`,
};

const buttonForLinkedIn = document.createElement('button');
buttonSetting(buttonForLinkedIn, logos.linkedIn)

const buttonForGithub = document.createElement('button');
buttonSetting(buttonForGithub, logos.github)

const buttonForBlog = document.createElement('button');
buttonSetting(buttonForBlog, logos.blog)

const buttonForYoutube = document.createElement('button');
buttonSetting(buttonForYoutube, logos.youtube)

buttonForLinkedIn.addEventListener('click', () => {
    window.open('https://www.linkedin.com/in/jehwi-son-629192299/', '_blank');
});

buttonForGithub.addEventListener('click', () => {
    window.open('https://github.com/MANGRYANG', '_blank');
});

buttonForBlog.addEventListener('click', () => {
    window.open('https://medium.com/@mangryang.dev', '_blank');
});

buttonForYoutube.addEventListener('click', () => {
    window.open('https://www.youtube.com/@water_dokkaebi', '_blank');
});

buttonContainer.appendChild(buttonForLinkedIn);
buttonContainer.appendChild(buttonForGithub);
buttonContainer.appendChild(buttonForBlog);
buttonContainer.appendChild(buttonForYoutube);

function buttonSetting(button, logoUrl) {
    button.style.width = '95px';
    button.style.height = '70px';
    button.style.margin = '15px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';

    const logo = document.createElement('img');
    logo.src = logoUrl;
    logo.alt = 'Logo';
    logo.style.height = '75%';

    button.appendChild(logo);
}