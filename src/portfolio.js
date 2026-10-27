// portfolio.js

const unlockedPortfolios = [false, false, false, false, false];

let isPortfolioListVisible = false;

const pendingHighlights = new Set();

const portfolioTitles = [
    "PixelOS",
    "GpuDrivenVFX",
    "CppNetworkArena",
    "Blank",
    "Portfolio"
];

document.addEventListener("DOMContentLoaded", () => {
    showPortfolioList();
});

function showPortfolioList() {
    isPortfolioListVisible = true;

    const portfolioDiv = document.getElementById('portfolio');

    portfolioDiv.innerHTML = "";

    Object.assign(portfolioDiv.style, {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowY: "auto"
    });

    const heading = document.createElement('h2');
    heading.textContent = "Portfolios";

    Object.assign(heading.style, {
        color: "white",
        fontFamily: "'Nova Square', sans-serif",
        fontSize: "20px",
        margin: "32px 0 32px"
    });

    portfolioDiv.appendChild(heading);

    portfolioTitles.forEach((title, id) => {
        const unlocked = unlockedPortfolios[id];
        const button = document.createElement('button');

        button.type = "button";
        button.disabled = !unlocked;
        button.textContent = unlocked
            ? title
            : `${id + 1}. Locked`;

        Object.assign(button.style, {
            width: "80%",
            minHeight: "60px",
            flexShrink: "0",
            marginBottom: "14px",
            padding: "12px",
            border: unlocked ? "2px solid white" : "2px solid #555",
            borderRadius: "4px",
            backgroundColor: unlocked ? "#282238" : "#171717",
            color: unlocked ? "white" : "#888",
            fontFamily: "'Nova Square', sans-serif",
            fontSize: "16px",
            cursor: unlocked ? "pointer" : "not-allowed"
        });

        button.addEventListener('click', () => {
            showPortfolioById(id);
        });

        portfolioDiv.appendChild(button);

        if (unlocked && pendingHighlights.has(id)) {
            button.animate(
                [
                    {
                        offset: 0,
                        transform: "scale(1)",
                        borderColor: "#ffd54a",
                        backgroundColor: "#282238",
                        boxShadow: "0 0 0px rgba(255, 213, 74, 0)"
                    },
                    {
                        offset: 0.45,
                        transform: "scale(1.04)",
                        borderColor: "#fff2a8",
                        backgroundColor: "#59471b",
                        boxShadow: "0 0 20px rgba(255, 213, 74, 0.9)"
                    },
                    {
                        offset: 1,
                        transform: "scale(1)",
                        borderColor: "#ffffff",
                        backgroundColor: "#282238",
                        boxShadow: "0 0 0px rgba(255, 213, 74, 0)"
                    }
                ],
                {
                    duration: 1000,
                    iterations: 1,
                    easing: "ease-in-out"
                }
            );

            pendingHighlights.delete(id);
        }
    });
}

function showPortfolio(title, description, techStack, keyPoints, githubUrl) {
    isPortfolioListVisible = false;

    const portfolioDiv = document.getElementById('portfolio');

    portfolioDiv.innerHTML = "";

    const backButton = document.createElement('button');
    backButton.type = "button";
    backButton.textContent = "←";

    Object.assign(backButton.style, {
        position: "absolute",
        top: "12px",
        left: "12px",
        zIndex: "10",
        padding: "4px 8px",
        border: "1px solid white",
        borderRadius: "4px",
        backgroundColor: "#000000",
        color: "white",
        cursor: "pointer",
        fontSize: "13px",
        fontFamily: "'Nova Square', sans-serif"
    });

    backButton.addEventListener('click', showPortfolioList);
    portfolioDiv.appendChild(backButton);

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
    descriptionElement.style.whiteSpace = "pre-line";
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

function showPortfolioById(portfolioId) {
    if (!unlockedPortfolios[portfolioId]) return;

    switch (portfolioId) {
        // First Portfolio : Scene01.js (PixelOS)
        case(0):
            showPortfolio
            (
                "PixelOS",
                "커스텀 OS 위에서 게임 애플리케이션을 실행하고, \nOS와 게임 사이의 상호작용을 관찰하는 프로젝트입니다.",
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

        // Second Portfolio : Scene03.js (GpuDrivenVFX)
        case(1):
            showPortfolio
            (
                "GpuDrivenVFX",
                "C++ / DirectX 11를 사용해 대량의 입자를 실시간 시뮬레이션하고,\nCPU와 GPU 처리 방식의 성능을 비교하는 VFX 프로젝트입니다.",
                ["C++", "DirectX 11", "HLSL"],
                [
                    "DirectX 11 렌더링 파이프라인 및 3D 입자 렌더링 구현",
                    "CPU 기반 입자 시뮬레이션 구현",
                    "HLSL Compute Shader 기반 GPU 입자 시뮬레이션 구현",
                    "입자 수 증가에 따른 성능 측정 및 CPU / GPU 비교 분석"
                ],
                "https://github.com/MANGRYANG/GpuDrivenVFX"
            );
            break;

        // Third Portfolio : Scene04.js (CppNetworkArena)
        case(2):
            showPortfolio
            (
                "CppNetworkArena",
                "C++과 Boost.Asio로 구현한 1대1 실시간 네트워크 게임으로,\nClient-Server 통신과 게임 상태 동기화를 구현한 프로젝트입니다.",
                ["C++", "Boost.Asio", "DirectX 11", "Dear ImGui"],
                [
                    "Boost.Asio 기반 Client-Server 통신 구현",
                    "게임 패킷 구조 설계 및 패킷 직렬화 / 역직렬화 로직 구현",
                    "서버에서 이동, 충돌, 득점을 판정하고 결과 전송",
                    "서버 스냅샷을 보간해 플레이어 이동을 부드럽게 표현",
                    "Ping-Pong 기반 RTT 측정 및 패킷 로그 시각화"
                ],
                "https://github.com/MANGRYANG/CppNetworkArena"
            );
            break;

        // Fourth Portfolio : Scene06.js
        case(3):
            break;

        // Fifth Portfolio : Scene06.js (Portfolio Website)
        case(4):
            showPortfolio
            (
                "Portfolio",
                "(지금까지 체험하신) 게임 기반 포트폴리오 개발 프로젝트입니다.",
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
}

document.addEventListener("portfolioUpdated", function(event) {
    const portfolioId = event.detail.portfolioId;

    if (!Number.isInteger(portfolioId) || portfolioId < 0 || portfolioId >= unlockedPortfolios.length) {
        return;
    }

    if (unlockedPortfolios[portfolioId]) return;

    unlockedPortfolios[portfolioId] = true;
    pendingHighlights.add(portfolioId);

    if (isPortfolioListVisible) {
        showPortfolioList();
    }
});