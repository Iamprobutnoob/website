const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');
const skillsCanvas = document.getElementById('skillsMatrixRain');
const skillsCtx = skillsCanvas.getContext('2d');
const aboutCanvas = document.getElementById('aboutMatrixRain');
const aboutCtx = aboutCanvas.getContext('2d');


function resizeCanvas() {
    const container = document.querySelector('.square-container');
    const skillsContainer = document.querySelector('.skills-container');
    const aboutContainer = document.querySelector('.about-container');
    
    if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    if (skillsContainer) {
        skillsCanvas.width = skillsContainer.offsetWidth;
        skillsCanvas.height = skillsContainer.offsetHeight;
    }
    
    if (aboutContainer) {
        aboutCanvas.width = aboutContainer.offsetWidth;
        aboutCanvas.height = aboutContainer.offsetHeight;
    }
}


resizeCanvas();



document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 3000);
});


window.onload = function() {
    
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
    });
    
    
    const profileSection = document.querySelector('.container-wrapper');
    if (profileSection) {
        profileSection.scrollIntoView({ behavior: 'auto' });
    }
    
    
    if (window.location.hash) {
        
        let hash = window.location.hash;
        
        
        history.pushState("", document.title, window.location.pathname + window.location.search);
        
        
        if (hash === '#skills') {
            setTimeout(() => {
                const skillsSection = document.querySelector('.second-section');
                if (skillsSection) {
                    skillsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
    }
    
    
    
    
    playMusicAutomatically();
};


window.addEventListener('hashchange', function() {
    
    const profileSection = document.querySelector('.container-wrapper');
    if (profileSection) {
        profileSection.scrollIntoView({ behavior: 'auto' });
    }
    
    
    if (window.location.hash === '#skills') {
        setTimeout(() => {
            const skillsSection = document.querySelector('.second-section');
            if (skillsSection) {
                skillsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }
});


let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 250);
});


const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ';
const charSize = 12; 


function initializeDrops(canvas) {
    const columns = canvas.width / charSize;
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height / charSize);
    }
    return drops;
}

let drops = initializeDrops(canvas);
let skillsDrops = initializeDrops(skillsCanvas);
let aboutDrops = initializeDrops(aboutCanvas);


function drawMatrixRain(ctx, canvas, drops) {
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    for (let i = 0; i < drops.length; i++) {
        
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        
        const x = i * charSize;
        const y = drops[i] * charSize;

        
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
        ctx.font = charSize + 'px monospace';

        
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#0F0';
        
        
        ctx.fillText(char, x, y);
        
        
        ctx.shadowBlur = 0;

        
        drops[i]++;

        
        if (drops[i] * charSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
    }
}


let animationFrame;
function animate() {
    drawMatrixRain(ctx, canvas, drops);
    drawMatrixRain(skillsCtx, skillsCanvas, skillsDrops);
    drawMatrixRain(aboutCtx, aboutCanvas, aboutDrops);
    animationFrame = requestAnimationFrame(animate);
}
animate();


function cleanup() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
}


window.addEventListener('unload', cleanup);


document.addEventListener('DOMContentLoaded', function() {
    
    function updateViewCount() {
        const viewCountElement = document.getElementById('viewCount');
        if (!viewCountElement) return;
        
        
        let count = localStorage.getItem('darkShadowViewCount');
        
        
        if (!count) {
            count = 0;
        }
        
        
        count = parseInt(count) + 1;
        
        
        localStorage.setItem('darkShadowViewCount', count);
        
        
        animateCounterUpdate(viewCountElement, count);
    }
    
    
    function animateCounterUpdate(element, newValue) {
        
        element.style.transition = 'text-shadow 0.5s ease-in-out';
        element.style.textShadow = '0 0 20px rgba(0, 255, 255, 1), 0 0 30px rgba(0, 255, 255, 0.8)';
        
        
        element.textContent = newValue;
        
        
        setTimeout(() => {
            element.style.textShadow = '';
        }, 500);
    }
    
    
    updateViewCount();
    
    
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const skillsSection = document.querySelector('.second-section');
    const terminalBody = document.querySelector('.terminal-body');
    const floatingTerminal = document.querySelector('.floating-terminal');
    const terminalToggle = document.querySelector('.terminal-toggle');
    const terminalHeader = document.querySelector('.terminal-header');
    
    
    let hasInteracted = false;
    document.addEventListener('click', function() {
        if (!hasInteracted) {
            hasInteracted = true;
            
            const currentTrack = tracks[currentTrackIndex].element;
            if (currentTrack && !isPlaying) {
                currentTrack.play().then(() => {
                    isPlaying = true;
                    if (musicToggle) {
                        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                        musicToggle.classList.add('music-active');
                    }
                    if (musicInfo) {
                        musicInfo.style.display = 'flex';
                    }
                    updateMusicInfo();
                }).catch(error => {
                    console.warn('Failed to play audio after interaction:', error);
                });
            }
        }
    }, { once: true });
    
    
    if (terminalHeader && floatingTerminal) {
        let isDragging = false;
        let offsetX, offsetY;
        
        terminalHeader.addEventListener('mousedown', function(e) {
            
            if (e.target.closest('.terminal-buttons')) return;
            
            isDragging = true;
            floatingTerminal.classList.add('dragging');
            
            
            const rect = floatingTerminal.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            
            floatingTerminal.style.left = x + 'px';
            floatingTerminal.style.top = y + 'px';
            
            
            floatingTerminal.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            floatingTerminal.classList.remove('dragging');
        });
        
        
        window.addEventListener('resize', function() {
            if (floatingTerminal.style.display === 'block') {
                const rect = floatingTerminal.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                
                if (rect.right > viewportWidth) {
                    floatingTerminal.style.left = (viewportWidth - rect.width - 20) + 'px';
                }
                
                if (rect.bottom > viewportHeight) {
                    floatingTerminal.style.top = (viewportHeight - rect.height - 20) + 'px';
                }
                
                if (rect.left < 0) {
                    floatingTerminal.style.left = '20px';
                }
                
                if (rect.top < 0) {
                    floatingTerminal.style.top = '20px';
                }
            }
        });
    }
    
    
    const hackingCodeSnippets = [
        "const bypass = async (target) => { await injectPayload(target, 0x7FFF); return await escalatePrivileges(); }",
        "function crackPassword(hash) { return bruteForce(hash, dictionary, { method: 'rainbow', depth: 7 }); }",
        "class Exploit { constructor(target) { this.target = target; this.vulnerabilities = scanForVulnerabilities(target); } }",
        "ssh.connect({host: target_ip, username: 'root', privateKey: decryptedKey});",
        "for(let i=0; i<ports.length; i++) { if(scanPort(target, ports[i])) openPorts.push(ports[i]); }",
        "const response = await fetch(url, { method: 'POST', headers: { 'X-Auth-Token': token } });",
        "sudo chmod 777 /var/www/html && echo 'Backdoor installed' > /var/log/access.log",
        "db.query('SELECT * FROM users WHERE username = \'' + input + '\' AND password = \'' + pwd + '\'');",
        "const buffer = Buffer.alloc(64); const overflow = Buffer.from('A'.repeat(128)); buffer.copy(overflow);",
        "grep -r 'password' /etc/ 2>/dev/null | sort | uniq > passwords.txt"
    ];
    
    const hackingMessages = [
        "Initializing attack vectors...",
        "Scanning target for vulnerabilities...",
        "Bypassing firewall...",
        "Exploiting security flaw in port 443...",
        "Injecting payload...",
        "Establishing secure connection...",
        "Bypassing authentication...",
        "Escalating privileges...",
        "Extracting sensitive data...",
        "Covering tracks...",
        "Deploying backdoor...",
        "Cracking password hashes...",
        "Intercepting network traffic...",
        "Analyzing system architecture...",
        "Bypassing two-factor authentication...",
        "Exploiting zero-day vulnerability...",
        "Executing man-in-the-middle attack...",
        "Deploying rootkit...",
        "Initiating DDoS sequence...",
        "Compromising target system..."
    ];
    
    const hackingResults = [
        "Access granted. Root privileges obtained.",
        "Target system compromised successfully.",
        "All security measures bypassed. Full access achieved.",
        "Backdoor installed. Remote access established.",
        "Operation complete. No traces left behind."
    ];
    
    
    if (terminalToggle && floatingTerminal) {
        terminalToggle.addEventListener('click', function() {
            if (floatingTerminal.style.display === 'block') {
                floatingTerminal.style.display = 'none';
            } else {
                floatingTerminal.style.display = 'block';
                terminalInput.focus();
                
                
                floatingTerminal.style.transition = 'box-shadow 0.5s ease-in-out';
                floatingTerminal.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.7)';
                setTimeout(() => {
                    floatingTerminal.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
                }, 500);
            }
        });
    }
    
    
    function setupTerminal() {
        if (!terminalInput || !terminalOutput || !terminalBody) {
            console.warn('Terminal elements not found');
            return;
        }
        
        
        terminalBody.addEventListener('click', function() {
            terminalInput.focus();
        });
        
        
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    
    setupTerminal();
    
    
    function typeWriter(text, element, speed = 30, className = '') {
        return new Promise((resolve) => {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    if (className) {
                        element.innerHTML += `<div class="line ${className}">${text.charAt(i)}</div>`;
                    } else {
                        element.innerHTML += text.charAt(i);
                    }
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    i++;
                } else {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }
    
    
    async function simulateHacking(target = 'random') {
        
        terminalInput.disabled = true;
        
        
        terminalOutput.innerHTML += `<div class="line"><span class="command">Initializing hack sequence on target: ${target}</span></div>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        
        const messageCount = 5 + Math.floor(Math.random() * 5); 
        const usedIndices = new Set();
        
        for (let i = 0; i < messageCount; i++) {
            
            let index;
            do {
                index = Math.floor(Math.random() * hackingMessages.length);
            } while (usedIndices.has(index));
            usedIndices.add(index);
            
            const message = hackingMessages[index];
            
            
            const messageElement = document.createElement('div');
            messageElement.className = 'line';
            terminalOutput.appendChild(messageElement);
            await typeWriter(message, messageElement, 15);
            
            
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
            
            
            if (i > 0 && Math.random() > 0.5) {
                const codeIndex = Math.floor(Math.random() * hackingCodeSnippets.length);
                const code = hackingCodeSnippets[codeIndex];
                terminalOutput.innerHTML += `<div class="line code">${code}</div>`;
                terminalBody.scrollTop = terminalBody.scrollHeight;
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
            }
            
            
            if (Math.random() > 0.7) {
                const progressElement = document.createElement('div');
                progressElement.className = 'line';
                terminalOutput.appendChild(progressElement);
                
                
                let progress = 0;
                const progressBar = document.createElement('div');
                progressBar.className = 'hack-progress';
                progressBar.innerHTML = '[' + '░'.repeat(20) + '] 0%';
                progressElement.appendChild(progressBar);
                
                
                while (progress < 100) {
                    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 70));
                    progress += Math.floor(Math.random() * 10) + 1;
                    if (progress > 100) progress = 100;
                    
                    const filled = Math.floor(progress / 5);
                    const empty = 20 - filled;
                    progressBar.innerHTML = '[' + '█'.repeat(filled) + '░'.repeat(empty) + '] ' + progress + '%';
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
                
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        const resultIndex = Math.floor(Math.random() * hackingResults.length);
        terminalOutput.innerHTML += `<div class="line success">${hackingResults[resultIndex]}</div>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        
        terminalInput.disabled = false;
        terminalInput.focus();
    }
    
    
    const commands = {
        'help': {
            description: 'Display available commands',
            action: function() {
                let output = '<div class="line">Available commands:</div>';
                for (const cmd in commands) {
                    output += `<div class="line"><span class="command">${cmd}</span> - ${commands[cmd].description}</div>`;
                }
                return output;
            }
        },
        'skills': {
            description: 'View my programming skills',
            action: function() {
                if (skillsSection) {
                    setTimeout(() => {
                        skillsSection.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                    return '<div class="line success">Navigating to skills section...</div>';
                } else {
                    return '<div class="line error">Error: Skills section not found.</div>';
                }
            }
        },
        'about': {
            description: 'View about me section',
            action: function() {
                const aboutSection = document.querySelector('.about-section');
                if (aboutSection) {
                    setTimeout(() => {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                    return '<div class="line success">Navigating to about me section...</div>';
                } else {
                    return '<div class="line error">Error: About section not found.</div>';
                }
            }
        },
        'clear': {
            description: 'Clear the terminal',
            action: function() {
                terminalOutput.innerHTML = '';
                return '';
            }
        },
        'echo': {
            description: 'Echo a message',
            action: function(args) {
                return `<div class="line">${args.join(' ')}</div>`;
            }
        },
        'info': {
            description: 'Display quick information about me',
            action: function() {
                return `<div class="line">Dark_Shadow - Cybersecurity Specialist & Developer</div>
                        <div class="line">Master of multiple programming languages and digital security.</div>
                        <div class="line">Type <span class="command">about</span> to view detailed information.</div>
                        <div class="line">Type <span class="command">skills</span> to see my technical expertise.</div>`;
            }
        },
        'date': {
            description: 'Display current date and time',
            action: function() {
                return `<div class="line">${new Date().toLocaleString()}</div>`;
            }
        },
        'matrix': {
            description: 'Toggle Matrix rain effect',
            action: function() {
                const matrixCanvas = document.getElementById('matrixRain');
                const skillsMatrixCanvas = document.getElementById('skillsMatrixRain');
                
                if (matrixCanvas.style.opacity === '0') {
                    matrixCanvas.style.opacity = '1';
                    skillsMatrixCanvas.style.opacity = '1';
                    return '<div class="line success">Matrix rain effect enabled.</div>';
                } else {
                    matrixCanvas.style.opacity = '0';
                    skillsMatrixCanvas.style.opacity = '0';
                    return '<div class="line">Matrix rain effect disabled.</div>';
                }
            }
        },
        'home': {
            description: 'Return to the profile section',
            action: function() {
                const profileSection = document.querySelector('.container-wrapper');
                if (profileSection) {
                    setTimeout(() => {
                        profileSection.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                    return '<div class="line success">Navigating to profile section...</div>';
                } else {
                    return '<div class="line error">Error: Profile section not found.</div>';
                }
            }
        },
        'exit': {
            description: 'Close the terminal',
            action: function() {
                if (floatingTerminal) {
                    floatingTerminal.style.display = 'none';
                }
                return '<div class="line">Closing terminal...</div>';
            }
        },
        'hack': {
            description: 'Simulate a hacking sequence on a target',
            action: function(args) {
                const target = args.length > 0 ? args.join(' ') : 'random-target';
                
                
                setTimeout(() => {
                    simulateHacking(target);
                }, 300);
                
                return '<div class="line warning">Initiating hack sequence...</div>';
            }
        },
        'music': {
            description: 'Control music playback (play/pause/next/prev/mute)',
            action: function(args) {
                const subCommand = args[0]?.toLowerCase();
                
                switch (subCommand) {
                    case 'play':
                        if (!isPlaying) {
                            togglePlayPause();
                            return '<div class="line success">Playing music...</div>';
                        } else {
                            return '<div class="line info">Music is already playing</div>';
                        }
                    case 'pause':
                        if (isPlaying) {
                            togglePlayPause();
                            return '<div class="line success">Pausing music...</div>';
                        } else {
                            return '<div class="line info">Music is already paused</div>';
                        }
                    case 'next':
                        playNextTrack();
                        return '<div class="line success">Playing next track...</div>';
                    case 'prev':
                        playPreviousTrack();
                        return '<div class="line success">Playing previous track...</div>';
                    case 'mute':
                        toggleMute();
                        return `<div class="line success">Music ${isMuted ? 'muted' : 'unmuted'}...</div>`;
                    default:
                        return `<div class="line">Music commands: play, pause, next, prev, mute</div>
                                <div class="line">Current track: ${trackNames[currentTrack]}</div>
                                <div class="line">Status: ${isPlaying ? 'Playing' : 'Paused'}, ${isMuted ? 'Muted' : 'Unmuted'}</div>`;
                }
            }
        }
    };
    
    
    function processCommand(input) {
        const args = input.trim().split(' ');
        const cmd = args.shift().toLowerCase();
        
        if (cmd === '') {
            return '';
        }
        
        if (commands[cmd]) {
            return commands[cmd].action(args);
        } else {
            return `<div class="line error">Command not found: ${cmd}. Type <span class="command">help</span> for available commands.</div>`;
        }
    }
    
    
    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const input = terminalInput.value;
                
                
                terminalOutput.innerHTML += `<div class="line"><span class="prompt">dark_shadow@system:~$</span> ${input}</div>`;
                
                
                const result = processCommand(input);
                if (result) {
                    terminalOutput.innerHTML += result;
                }
                
                
                terminalInput.value = '';
                if (terminalBody) {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            }
        });
    }
    
    
    const closeButton = document.querySelector('.terminal-button.close');
    const minimizeButton = document.querySelector('.terminal-button.minimize');
    const maximizeButton = document.querySelector('.terminal-button.maximize');
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (floatingTerminal) {
                floatingTerminal.style.display = 'none';
            }
        });
    }
    
    if (minimizeButton) {
        minimizeButton.addEventListener('click', function() {
            const terminalBody = document.querySelector('.terminal-body');
            if (terminalBody) {
                if (terminalBody.style.display === 'none') {
                    terminalBody.style.display = 'block';
                } else {
                    terminalBody.style.display = 'none';
                }
            }
        });
    }
    
    if (maximizeButton) {
        maximizeButton.addEventListener('click', function() {
            if (floatingTerminal) {
                if (floatingTerminal.classList.contains('maximized')) {
                    floatingTerminal.classList.remove('maximized');
                } else {
                    floatingTerminal.classList.add('maximized');
                }
            }
        });
    }
    
    
    setTimeout(() => {
        if (terminalOutput) {
            terminalOutput.innerHTML += '<div class="line info">Press the terminal button in the top-right corner to toggle the console.</div>';
        }
    }, 2000);
    
    
    const username = document.querySelector('.username');
    if (!username) {
        console.warn('Username element not found');
        return;
    }
    
    
    const originalHTML = username.innerHTML;
    const originalStyle = window.getComputedStyle(username);
    
    
    const textContent = username.textContent.trim();
    const textParts = textContent.split(/\s+/).filter(part => part && !part.includes(''));
    const originalText = textParts[1] || "Dark_Shadow"; 
    
    
    const icons = {
        left: '<i class="fas fa-ghost"></i>',
        right: '<i class="fas fa-ghost"></i>'
    };
    
    
    try {
        const iconMatches = originalHTML.match(/<i[^>]*fa-ghost[^>]*><\/i>/g) || [];
        if (iconMatches.length >= 2) {
            icons.left = iconMatches[0];
            icons.right = iconMatches[1];
        } else {
            console.warn('Could not find both icons, using defaults');
        }
    } catch (error) {
        console.warn('Error extracting icons:', error);
    }
    
    
    function generateGlitchedText() {
        const glitchChars = "!@#$%^&*()_+{}|:<>?";
        const maxGlitchChars = Math.ceil(originalText.length * 0.3); 
        let glitchCount = 0;
        
        return originalText.split('').map((char, index) => {
            
            if (glitchCount >= maxGlitchChars) return char;
            
            
            const position = index / originalText.length;
            const glitchChance = position > 0.2 && position < 0.8 ? 0.3 : 0.1;
            
            if (Math.random() < glitchChance) {
                glitchCount++;
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
        }).join('');
    }
    
    
    function updateUsernameContent(glitchedText) {
        if (!username || !glitchedText) return;
        
        try {
            const newContent = `${icons.left} ${glitchedText} ${icons.right}`;
            if (newContent !== username.innerHTML) {
                username.innerHTML = newContent;
            }
        } catch (error) {
            console.warn('Error updating content:', error);
            resetContent();
        }
    }
    
    
    function resetContent() {
        if (!username) return;
        try {
            if (username.innerHTML !== originalHTML) {
                username.innerHTML = originalHTML;
            }
        } catch (error) {
            console.error('Critical error resetting content:', error);
        }
    }
    
    
    let glitchInterval = null;
    let isHovering = false;
    let lastUpdate = 0;
    const updateDelay = 100; 
    
    function startGlitchEffect() {
        if (isHovering || glitchInterval) return;
        
        isHovering = true;
        clearInterval(glitchInterval);
        
        glitchInterval = setInterval(() => {
            const now = Date.now();
            if (now - lastUpdate >= updateDelay) {
                updateUsernameContent(generateGlitchedText());
                lastUpdate = now;
            }
        }, updateDelay);
    }
    
    function stopGlitchEffect() {
        isHovering = false;
        if (glitchInterval) {
            clearInterval(glitchInterval);
            glitchInterval = null;
        }
        resetContent();
    }
    
    
    try {
        username.addEventListener('mouseover', startGlitchEffect);
        username.addEventListener('mouseout', stopGlitchEffect);
        username.addEventListener('blur', stopGlitchEffect); 
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
    
    
    function cleanup() {
        stopGlitchEffect();
        try {
            username.removeEventListener('mouseover', startGlitchEffect);
            username.removeEventListener('mouseout', stopGlitchEffect);
            username.removeEventListener('blur', stopGlitchEffect);
        } catch (error) {
            console.warn('Error during cleanup:', error);
        }
    }
    
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopGlitchEffect();
        }
    });
    
    
    window.addEventListener('unload', cleanup);
    
    
    window.addEventListener('beforeunload', cleanup);

    
    const progressBars = document.querySelectorAll('.progress');
    const skillsContainer = document.querySelector('.skills-container');
    
    
    function animateProgressBars() {
        progressBars.forEach(progress => {
            const percent = progress.getAttribute('data-percent');
            progress.style.width = percent + '%';
        });
    }
    
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    
    function checkProgressBars() {
        if (skillsSection && isInViewport(skillsSection)) {
            setTimeout(animateProgressBars, 500);
            window.removeEventListener('scroll', checkProgressBars);
        }
    }
    
    
    progressBars.forEach(progress => {
        progress.style.width = '0';
    });
    
    
    window.addEventListener('scroll', checkProgressBars);
    
    
    commands.skills.action = function() {
        if (skillsSection) {
            setTimeout(() => {
                skillsSection.scrollIntoView({ behavior: 'smooth' });
                
                setTimeout(animateProgressBars, 1000);
            }, 500);
            return '<div class="line success">Navigating to skills section...</div>';
        } else {
            return '<div class="line error">Error: Skills section not found.</div>';
        }
    };
    
    
    checkProgressBars();

    
    const musicToggle = document.querySelector('.music-toggle');
    const musicInfo = document.querySelector('.music-info');
    const musicTitle = document.querySelector('.music-title');
    const prevButton = document.querySelector('.music-prev');
    const nextButton = document.querySelector('.music-next');
    
    
    if (musicToggle) {
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        musicToggle.classList.add('music-active');
    }
    
    
    const tracks = [
        { element: document.getElementById('bgMusic1'), title: 'Home' },
        { element: document.getElementById('bgMusic2'), title: 'The Nights' },
        { element: document.getElementById('bgMusic3'), title: 'Life Story' },
        { element: document.getElementById('bgMusic4'), title: 'Song 4' }
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false;
    
    
    function initMusicPlayer() {
        const musicToggle = document.querySelector('.music-toggle');
        const musicInfo = document.querySelector('.music-info');
        const musicTitle = document.querySelector('.music-title');
        const prevButton = document.querySelector('.music-prev');
        const nextButton = document.querySelector('.music-next');
        const playPauseButton = document.querySelector('.music-play-pause');
        const muteButton = document.querySelector('.music-mute');
        
        const bgMusic1 = document.getElementById('bgMusic1');
        const bgMusic2 = document.getElementById('bgMusic2');
        const bgMusic3 = document.getElementById('bgMusic3');
        const bgMusic4 = document.getElementById('bgMusic4');
        
        const allTracks = [bgMusic1, bgMusic2, bgMusic3, bgMusic4];
        const trackNames = ['Home', 'The Nights', 'Life Story', 'Song 4'];
        
        let currentTrack = 0;
        let isPlaying = false;
        let isMuted = false;
        
        // Initialize volume for all tracks
        allTracks.forEach(track => {
            track.volume = 0.7;
        });
        
        function playMusicAutomatically() {
            if (musicToggle.classList.contains('music-active')) {
                playTrack(currentTrack);
                isPlaying = true;
                updatePlayPauseIcon();
            }
        }
        
        function toggleMusic() {
            if (musicToggle.classList.contains('music-active')) {
                // Turn off music
                musicToggle.classList.remove('music-active');
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                musicInfo.style.display = 'none';
                
                // Pause all tracks
                allTracks.forEach(track => {
                    track.pause();
                });
                
                isPlaying = false;
                updatePlayPauseIcon();
            } else {
                // Turn on music
                musicToggle.classList.add('music-active');
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                musicInfo.style.display = 'flex';
                
                // Play current track
                playTrack(currentTrack);
                isPlaying = true;
                updatePlayPauseIcon();
            }
        }
        
        function updateMusicInfo() {
            musicTitle.textContent = trackNames[currentTrack];
        }
        
        function playPreviousTrack() {
            // Pause current track
            allTracks[currentTrack].pause();
            allTracks[currentTrack].currentTime = 0;
            
            // Update current track index
            currentTrack = (currentTrack - 1 + allTracks.length) % allTracks.length;
            
            // Play new track
            playTrack(currentTrack);
            isPlaying = true;
            updatePlayPauseIcon();
        }
        
        function playNextTrack() {
            // Pause current track
            allTracks[currentTrack].pause();
            allTracks[currentTrack].currentTime = 0;
            
            // Update current track index
            currentTrack = (currentTrack + 1) % allTracks.length;
            
            // Play new track
            playTrack(currentTrack);
            isPlaying = true;
            updatePlayPauseIcon();
        }
        
        function togglePlayPause() {
            if (isPlaying) {
                // Pause current track
                allTracks[currentTrack].pause();
                isPlaying = false;
            } else {
                // Play current track
                playTrack(currentTrack);
                isPlaying = true;
            }
            updatePlayPauseIcon();
        }
        
        function toggleMute() {
            isMuted = !isMuted;
            
            allTracks.forEach(track => {
                track.muted = isMuted;
            });
            
            updateMuteIcon();
        }
        
        function updatePlayPauseIcon() {
            if (isPlaying) {
                playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseButton.classList.add('active');
            } else {
                playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
                playPauseButton.classList.remove('active');
            }
        }
        
        function updateMuteIcon() {
            if (isMuted) {
                muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
                muteButton.classList.add('active');
            } else {
                muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
                muteButton.classList.remove('active');
            }
        }
        
        function playTrack(trackIndex) {
            // Pause all tracks first
            allTracks.forEach(track => {
                track.pause();
                track.currentTime = 0;
            });
            
            // Play selected track
            allTracks[trackIndex].play();
            updateMusicInfo();
        }
        
        function setupTrackEndHandlers() {
            allTracks.forEach((track, index) => {
                track.addEventListener('ended', () => {
                    // When track ends, play next track
                    currentTrack = (index + 1) % allTracks.length;
                    playTrack(currentTrack);
                });
            });
        }
        
        // Event listeners
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', playPreviousTrack);
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', playNextTrack);
        }
        
        if (playPauseButton) {
            playPauseButton.addEventListener('click', togglePlayPause);
        }
        
        if (muteButton) {
            muteButton.addEventListener('click', toggleMute);
        }
        
        // Setup track end handlers
        setupTrackEndHandlers();
        
        // Start playing music automatically
        setTimeout(playMusicAutomatically, 4000);
        
        // Add music commands to terminal
        commands['music'] = {
            description: 'Control music playback (play/pause/next/prev/mute)',
            action: function(args) {
                const subCommand = args[0]?.toLowerCase();
                
                switch (subCommand) {
                    case 'play':
                        if (!isPlaying) {
                            togglePlayPause();
                            return '<div class="line success">Playing music...</div>';
                        } else {
                            return '<div class="line info">Music is already playing</div>';
                        }
                    case 'pause':
                        if (isPlaying) {
                            togglePlayPause();
                            return '<div class="line success">Pausing music...</div>';
                        } else {
                            return '<div class="line info">Music is already paused</div>';
                        }
                    case 'next':
                        playNextTrack();
                        return '<div class="line success">Playing next track...</div>';
                    case 'prev':
                        playPreviousTrack();
                        return '<div class="line success">Playing previous track...</div>';
                    case 'mute':
                        toggleMute();
                        return `<div class="line success">Music ${isMuted ? 'muted' : 'unmuted'}...</div>`;
                    default:
                        return `<div class="line">Music commands: play, pause, next, prev, mute</div>
                                <div class="line">Current track: ${trackNames[currentTrack]}</div>
                                <div class="line">Status: ${isPlaying ? 'Playing' : 'Paused'}, ${isMuted ? 'Muted' : 'Unmuted'}</div>`;
                }
            }
        };
        
        return {
            toggleMusic,
            playPreviousTrack,
            playNextTrack,
            togglePlayPause,
            toggleMute,
            getCurrentTrackName: () => trackNames[currentTrack]
        };
    }
    
    
    const musicPlayer = initMusicPlayer();
});

// Football Game
document.addEventListener('DOMContentLoaded', function() {
    // Football toggle functionality
    const footballToggle = document.querySelector('.football-toggle');
    const floatingFootball = document.querySelector('.floating-football');
    const footballHeader = document.querySelector('.football-header');
    const closeButton = document.querySelector('.floating-football .terminal-button.close');
    const minimizeButton = document.querySelector('.floating-football .terminal-button.minimize');
    const maximizeButton = document.querySelector('.floating-football .terminal-button.maximize');
    
    // Toggle football game
    if (footballToggle && floatingFootball) {
        footballToggle.addEventListener('click', function() {
            if (floatingFootball.style.display === 'block') {
                floatingFootball.style.display = 'none';
            } else {
                floatingFootball.style.display = 'block';
                
                // Visual feedback
                floatingFootball.style.transition = 'box-shadow 0.5s ease-in-out';
                floatingFootball.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.7)';
                setTimeout(() => {
                    floatingFootball.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
                }, 500);
                
                // Initialize game canvas if needed
                resizeGameCanvas();
            }
        });
    }
    
    // Make football window draggable
    if (footballHeader && floatingFootball) {
        let isDragging = false;
        let offsetX, offsetY;
        
        footballHeader.addEventListener('mousedown', function(e) {
            // Don't start dragging if clicking on buttons
            if (e.target.closest('.terminal-buttons')) return;
            
            isDragging = true;
            floatingFootball.classList.add('dragging');
            
            // Calculate offset
            const rect = floatingFootball.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Prevent default behavior
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // Calculate new position
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // Update position
            floatingFootball.style.left = x + 'px';
            floatingFootball.style.top = y + 'px';
            
            // Reset right position
            floatingFootball.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            floatingFootball.classList.remove('dragging');
        });
    }
    
    // Football window buttons
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (floatingFootball) {
                floatingFootball.style.display = 'none';
                
                // Pause the game if it's running
                if (gameActive) {
                    pauseGame();
                }
            }
        });
    }
    
    if (minimizeButton) {
        minimizeButton.addEventListener('click', function() {
            const footballBody = document.querySelector('.football-body');
            if (footballBody) {
                if (footballBody.style.display === 'none') {
                    footballBody.style.display = 'block';
                } else {
                    footballBody.style.display = 'none';
                }
            }
        });
    }
    
    if (maximizeButton) {
        maximizeButton.addEventListener('click', function() {
            if (floatingFootball) {
                if (floatingFootball.classList.contains('maximized')) {
                    floatingFootball.classList.remove('maximized');
                } else {
                    floatingFootball.classList.add('maximized');
                }
                
                // Resize the game canvas after maximizing/minimizing
                setTimeout(resizeGameCanvas, 300);
            }
        });
    }
    
    // Game implementation
    const canvas = document.getElementById('footballGame');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startGame');
    const resetButton = document.getElementById('resetGame');
    const gameOverlay = document.querySelector('.game-overlay');
    const scoreElement = document.getElementById('gameScore');
    const timeElement = document.getElementById('gameTime');
    
    // Game variables
    let gameActive = false;
    let gamePaused = false;
    let score = 0;
    let timeLeft = 30;
    let gameTimer;
    let animationFrame;
    
    // Player variables
    let playerX = 0;
    let playerY = 0;
    let playerWidth = 30;
    let playerHeight = 40;
    let playerSpeed = 5;
    let playerDirection = 0; // -1 left, 0 still, 1 right
    
    // Ball variables
    let ballX = 0;
    let ballY = 0;
    let ballRadius = 8;
    let ballSpeedX = 0;
    let ballSpeedY = 0;
    let ballActive = false;
    
    // Goal variables
    let goalWidth = 100;
    let goalHeight = 50;
    let goalX = 0;
    let goalY = 0;
    
    // Goalkeeper variables
    let keeperX = 0;
    let keeperY = 0;
    let keeperWidth = 30;
    let keeperHeight = 40;
    let keeperSpeed = 3;
    let keeperDirection = 1;
    
    // Game field dimensions
    let fieldWidth = canvas.width;
    let fieldHeight = canvas.height;
    
    // Resize canvas to match container
    function resizeGameCanvas() {
        const gameField = document.querySelector('.game-field');
        if (!gameField || !canvas) return;
        
        canvas.width = gameField.clientWidth - 4; // Account for border
        canvas.height = gameField.clientHeight - 4;
        fieldWidth = canvas.width;
        fieldHeight = canvas.height;
        
        // Reset positions based on new dimensions
        resetPositions();
        
        // Redraw the game
        drawGame();
    }
    
    // Initialize positions
    function resetPositions() {
        playerX = fieldWidth / 2 - playerWidth / 2;
        playerY = fieldHeight - playerHeight - 10;
        
        goalX = fieldWidth / 2 - goalWidth / 2;
        goalY = 0;
        
        keeperX = fieldWidth / 2 - keeperWidth / 2;
        keeperY = goalHeight;
        
        resetBall();
    }
    
    // Reset ball position
    function resetBall() {
        ballX = playerX + playerWidth / 2;
        ballY = playerY - ballRadius;
        ballSpeedX = 0;
        ballSpeedY = 0;
        ballActive = false;
    }
    
    // Start game
    function startGame() {
        if (gameActive) return;
        
        gameActive = true;
        gamePaused = false;
        score = 0;
        timeLeft = 30;
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        
        resetPositions();
        gameOverlay.style.display = 'none';
        
        // Start game timer
        gameTimer = setInterval(() => {
            if (gamePaused) return;
            
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        // Start game loop
        cancelAnimationFrame(animationFrame);
        gameLoop();
    }
    
    // Pause game
    function pauseGame() {
        if (!gameActive) return;
        
        gamePaused = true;
        cancelAnimationFrame(animationFrame);
        clearInterval(gameTimer);
    }
    
    // Resume game
    function resumeGame() {
        if (!gameActive || !gamePaused) return;
        
        gamePaused = false;
        
        // Restart timer
        gameTimer = setInterval(() => {
            if (gamePaused) return;
            
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        // Restart game loop
        gameLoop();
    }
    
    // End game
    function endGame() {
        gameActive = false;
        gamePaused = false;
        clearInterval(gameTimer);
        cancelAnimationFrame(animationFrame);
        
        gameOverlay.style.display = 'flex';
        startButton.innerHTML = '<i class="fas fa-play"></i> Play Again';
    }
    
    // Reset game
    function resetGame() {
        endGame();
        score = 0;
        timeLeft = 30;
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        resetPositions();
        drawGame();
    }
    
    // Handle keyboard input
    const keys = {};
    
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        
        // Shoot ball with spacebar
        if (e.key === ' ' && gameActive && !gamePaused && !ballActive) {
            shootBall();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Shoot the ball
    function shootBall() {
        if (ballActive) return;
        
        ballActive = true;
        ballSpeedY = -10;
        ballSpeedX = (Math.random() - 0.5) * 4; // Add some random horizontal movement
    }
    
    // Update player position
    function updatePlayer() {
        playerDirection = 0;
        
        if (keys['a'] || keys['arrowleft']) {
            playerDirection = -1;
            playerX -= playerSpeed;
        }
        
        if (keys['d'] || keys['arrowright']) {
            playerDirection = 1;
            playerX += playerSpeed;
        }
        
        // Keep player within bounds
        if (playerX < 0) playerX = 0;
        if (playerX + playerWidth > fieldWidth) playerX = fieldWidth - playerWidth;
        
        // Update ball position if not active
        if (!ballActive) {
            ballX = playerX + playerWidth / 2;
            ballY = playerY - ballRadius;
        }
    }
    
    // Update ball position
    function updateBall() {
        if (!ballActive) return;
        
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Ball hits sides
        if (ballX - ballRadius < 0 || ballX + ballRadius > fieldWidth) {
            ballSpeedX = -ballSpeedX;
        }
        
        // Ball hits top
        if (ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }
        
        // Ball hits bottom (missed)
        if (ballY - ballRadius > fieldHeight) {
            resetBall();
        }
        
        // Check for goal
        checkGoal();
        
        // Check for keeper collision
        checkKeeperCollision();
    }
    
    // Update goalkeeper
    function updateKeeper() {
        keeperX += keeperSpeed * keeperDirection;
        
        // Keeper hits sides
        if (keeperX < goalX || keeperX + keeperWidth > goalX + goalWidth) {
            keeperDirection = -keeperDirection;
        }
    }
    
    // Check if ball scored a goal
    function checkGoal() {
        if (ballY - ballRadius < goalHeight && 
            ballX > goalX && 
            ballX < goalX + goalWidth && 
            !isColliding(ballX, ballY, ballRadius, keeperX, keeperY, keeperWidth, keeperHeight)) {
            
            // Goal scored!
            score++;
            scoreElement.textContent = score;
            resetBall();
            
            // Visual feedback
            const gameField = document.querySelector('.game-field');
            if (gameField) {
                gameField.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8) inset';
                setTimeout(() => {
                    gameField.style.boxShadow = '';
                }, 300);
            }
        }
    }
    
    // Check if ball hits keeper
    function checkKeeperCollision() {
        if (isColliding(ballX, ballY, ballRadius, keeperX, keeperY, keeperWidth, keeperHeight)) {
            // Bounce off keeper
            ballSpeedY = -ballSpeedY;
            ballSpeedX = (ballX - (keeperX + keeperWidth / 2)) / 3; // Deflection based on hit position
            
            // Visual feedback
            const gameField = document.querySelector('.game-field');
            if (gameField) {
                gameField.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5) inset';
                setTimeout(() => {
                    gameField.style.boxShadow = '';
                }, 200);
            }
        }
    }
    
    // Collision detection between circle and rectangle
    function isColliding(circleX, circleY, radius, rectX, rectY, rectWidth, rectHeight) {
        // Find closest point on rectangle to circle
        const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
        const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));
        
        // Calculate distance between circle center and closest point
        const distanceX = circleX - closestX;
        const distanceY = circleY - closestY;
        
        // Check if distance is less than radius
        return (distanceX * distanceX + distanceY * distanceY) < (radius * radius);
    }
    
    // Draw game elements
    function drawGame() {
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, fieldWidth, fieldHeight);
        
        // Draw field
        ctx.fillStyle = '#004400';
        ctx.fillRect(0, 0, fieldWidth, fieldHeight);
        
        // Draw field lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        
        // Center circle
        ctx.beginPath();
        ctx.arc(fieldWidth / 2, fieldHeight / 2, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        // Center line
        ctx.beginPath();
        ctx.moveTo(0, fieldHeight / 2);
        ctx.lineTo(fieldWidth, fieldHeight / 2);
        ctx.stroke();
        
        // Draw goal
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(goalX, goalY, goalWidth, goalHeight);
        
        // Draw goal net
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = goalX; x <= goalX + goalWidth; x += 10) {
            ctx.beginPath();
            ctx.moveTo(x, goalY);
            ctx.lineTo(x, goalY + goalHeight);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = goalY; y <= goalY + goalHeight; y += 10) {
            ctx.beginPath();
            ctx.moveTo(goalX, y);
            ctx.lineTo(goalX + goalWidth, y);
            ctx.stroke();
        }
        
        // Draw goalkeeper
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(keeperX, keeperY, keeperWidth, keeperHeight);
        
        // Draw player
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
        
        // Draw ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ball shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(ballX, ballY + ballRadius + 2, ballRadius, ballRadius / 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Game loop
    function gameLoop() {
        if (gameActive && !gamePaused) {
            updatePlayer();
            updateBall();
            updateKeeper();
            drawGame();
            animationFrame = requestAnimationFrame(gameLoop);
        }
    }
    
    // Event listeners
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }
    
    // Handle window visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && gameActive && !gamePaused) {
            pauseGame();
        } else if (!document.hidden && gameActive && gamePaused) {
            resumeGame();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', resizeGameCanvas);
    
    // Initialize game
    resizeGameCanvas();
    drawGame();
});




