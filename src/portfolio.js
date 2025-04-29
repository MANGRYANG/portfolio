// portfolio.js

document.addEventListener("DOMContentLoaded", () => {
    const portfolioDiv = document.getElementById('portfolio');
    
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

    
});
