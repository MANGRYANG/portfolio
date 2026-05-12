// portfolio.js

document.addEventListener("DOMContentLoaded", () => {
    showDefaultMessage();
});

function showDefaultMessage() {
    const portfolioDiv = document.getElementById('portfolio');
    
    portfolioDiv.innerHTML = "";

    const titleElement = document.createElement('div');
    titleElement.textContent = "Let's open the treasure chest and explore the portfolio!";
    titleElement.style.fontSize = "16px";
    titleElement.style.color = "white";
    titleElement.style.textAlign = "center";
    titleElement.style.fontFamily = "'Nova Square', sans-serif";
        
    portfolioDiv.appendChild(titleElement);

    const subtitleElement = document.createElement('div');
    subtitleElement.textContent = "- mangryang";
    subtitleElement.style.fontSize = "10px";
    subtitleElement.style.color = "white";
    subtitleElement.style.textAlign = "right";
    subtitleElement.style.width = "80%";
    subtitleElement.style.margin = "10px"
    subtitleElement.style.fontFamily = "'Nova Square', sans-serif";

    portfolioDiv.appendChild(subtitleElement);
        
    portfolioDiv.style.display = 'flex';
    portfolioDiv.style.flexDirection = 'column';
    portfolioDiv.style.alignItems = 'center';
    portfolioDiv.style.justifyContent = 'center';
} 

function showPortfolio(title, description, techStack, keyPoints, githubUrl) {
    const portfolioDiv = document.getElementById('portfolio');

    portfolioDiv.innerHTML = "";

    const titleElement = document.createElement('div');
    titleElement.textContent = title;
    titleElement.style.fontSize = "20px";
    titleElement.style.color = "white";
    titleElement.style.textAlign = "left";
    titleElement.style.width = "80%";
    titleElement.style.fontFamily = "'Nova Square', sans-serif";
    titleElement.style.marginBottom = "20px";

    portfolioDiv.appendChild(titleElement);

    const descriptionElement = document.createElement('div');
    descriptionElement.textContent = description;
    descriptionElement.style.fontSize = "14px";
    descriptionElement.style.color = "white";
    descriptionElement.style.textAlign = "left";
    descriptionElement.style.width = "80%";
    descriptionElement.style.lineHeight = "1.6";
    descriptionElement.style.fontFamily = "'Nova Square', sans-serif";

    portfolioDiv.appendChild(descriptionElement);

    const techStackTitleElement = document.createElement('div');
    techStackTitleElement.textContent = "Tech Stack";
    techStackTitleElement.style.fontSize = "16px";
    techStackTitleElement.style.color = "white";
    techStackTitleElement.style.textAlign = "left";
    techStackTitleElement.style.width = "80%";
    techStackTitleElement.style.fontFamily = "'Nova Square', sans-serif";
    techStackTitleElement.style.marginTop = "24px";
    techStackTitleElement.style.marginBottom = "8px";

    portfolioDiv.appendChild(techStackTitleElement);

    const techStackElement = document.createElement('div');
    techStackElement.textContent = techStack.join(" / ");
    techStackElement.style.fontSize = "13px";
    techStackElement.style.color = "white";
    techStackElement.style.textAlign = "left";
    techStackElement.style.width = "80%";
    techStackElement.style.lineHeight = "1.6";
    techStackElement.style.fontFamily = "'Nova Square', sans-serif";

    portfolioDiv.appendChild(techStackElement);

    const keyPointsTitleElement = document.createElement('div');
    keyPointsTitleElement.textContent = "Key Points";
    keyPointsTitleElement.style.fontSize = "16px";
    keyPointsTitleElement.style.color = "white";
    keyPointsTitleElement.style.textAlign = "left";
    keyPointsTitleElement.style.width = "80%";
    keyPointsTitleElement.style.fontFamily = "'Nova Square', sans-serif";
    keyPointsTitleElement.style.marginTop = "24px";
    keyPointsTitleElement.style.marginBottom = "8px";

    portfolioDiv.appendChild(keyPointsTitleElement);

    const keyPointsElement = document.createElement('ul');
    keyPointsElement.style.color = "white";
    keyPointsElement.style.textAlign = "left";
    keyPointsElement.style.width = "80%";
    keyPointsElement.style.margin = "0";
    keyPointsElement.style.paddingLeft = "20px";
    keyPointsElement.style.fontFamily = "'Nova Square', sans-serif";

    keyPoints.forEach(function(point) {
        const pointElement = document.createElement('li');
        pointElement.textContent = point;
        pointElement.style.fontSize = "13px";
        pointElement.style.lineHeight = "1.6";
        pointElement.style.marginBottom = "6px";

        keyPointsElement.appendChild(pointElement);
    });

    portfolioDiv.appendChild(keyPointsElement);

    portfolioDiv.style.display = 'flex';
    portfolioDiv.style.flexDirection = 'column';
    portfolioDiv.style.alignItems = 'center';
    portfolioDiv.style.justifyContent = 'center';

    const githubButtonElement = document.createElement('a');

    githubButtonElement.textContent = "GitHub Repository";
    githubButtonElement.href = githubUrl;
    githubButtonElement.target = "_blank";
    githubButtonElement.rel = "noopener noreferrer";

    githubButtonElement.style.display = "inline-block";
    githubButtonElement.style.marginTop = "24px";
    githubButtonElement.style.padding = "10px 16px";
    githubButtonElement.style.color = "black";
    githubButtonElement.style.backgroundColor = "white";
    githubButtonElement.style.textDecoration = "none";
    githubButtonElement.style.fontSize = "13px";
    githubButtonElement.style.fontFamily = "'Nova Square', sans-serif";
    githubButtonElement.style.borderRadius = "4px";

    portfolioDiv.appendChild(githubButtonElement);
}

function hidePortfolio() {
    showDefaultMessage();
}

document.addEventListener("portfolioUpdated", function(event) {
    switch(event.detail.portfolioId) {
        // Hide Portfolio
        case(-1):
            hidePortfolio();
            break;
        // First Portfolio : Scene01.js (PixelOS)
        case(0):
            showPortfolio
            (
                "PixelOS",
                "커스텀 OS 위에서 게임 애플리케이션을 실행하고, OS와 게임 사이의 상호작용을 관찰하는 프로젝트입니다.",
                ["C", "NASM", "x86"],
                [
                    "32-bit x86 커널 개발",
                    "키보드/마우스 입력, 타이머, 인터럽트 처리 구현",
                    "시스템 콜 기반 앱-커널 상호작용 실험",
                    "커스텀 OS 위에서 Pong 게임 실행"
                ],
                "https://github.com/MANGRYANG/PixelOS"
            );
            break;
        // Second Portfolio : Scene03.js
        case(1):
            break;
        // Third Portfolio : Scene04.js
        case(2):
            break;
        // Fourth Portfolio : Scene06.js
        case(3):
            break;
        // Fifth Portfolio : Scene06.js (Portfolio Website)
        case(4):
            showPortfolio
            (
                "Portfolio",
                "(지금 체험하고 계신) 게임 기반 포트폴리오 사이트 개발 프로젝트입니다.",
                ["JavaScript", "Phaser 3", "Vite", "HTML", "CSS", "Tiled"],
                [
                    "Phaser 3 기반 2D 웹 포트폴리오 구현",
                    "Scene 전환, 플레이어 이동, 맵 상호작용 구조 설계",
                    "보물 상자 이벤트와 DOM 기반 포트폴리오 패널 연동",
                    "Tiled Map JSON 기반 맵 구성 및 타일 애니메이션 처리",
                    "외부 링크 버튼을 통한 GitHub, Blog, LinkedIn 연결"
                ],
                "https://github.com/MANGRYANG/portfolio"
            );
            break;
        // -- Invalid Id
        default:
            console.log("Invalid portfolio Id")
            break;
    }
});
