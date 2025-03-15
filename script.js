// Matrix Rain Effect
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');
const skillsCanvas = document.getElementById('skillsMatrixRain');
const skillsCtx = skillsCanvas.getContext('2d');
const aboutCanvas = document.getElementById('aboutMatrixRain');
const aboutCtx = aboutCanvas.getContext('2d');

// Set canvas size based on container
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

// Initial setup
resizeCanvas();

// Ensure home section is shown first on page load
window.onload = function() {
    // Scroll to top of page to show bio section
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
    });
    
    // Force focus on the profile section
    const profileSection = document.querySelector('.container-wrapper');
    if (profileSection) {
        profileSection.scrollIntoView({ behavior: 'auto' });
    }
    
    // Clear any hash from URL to prevent automatic scrolling
    if (window.location.hash) {
        // Store the hash value
        let hash = window.location.hash;
        
        // Clear the hash without causing page reload
        history.pushState("", document.title, window.location.pathname + window.location.search);
        
        // If the hash was #skills, we'll still allow that to work after a short delay
        if (hash === '#skills') {
            setTimeout(() => {
                const skillsSection = document.querySelector('.second-section');
                if (skillsSection) {
                    skillsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        }
    }
    
    // Auto-play music immediately when page loads
    // This will attempt to play music right away, but browsers may still block it
    // until user interacts with the page
    playMusicAutomatically();
};

// Handle direct links with hash
window.addEventListener('hashchange', function() {
    // Always default to home/bio section first
    const profileSection = document.querySelector('.container-wrapper');
    if (profileSection) {
        profileSection.scrollIntoView({ behavior: 'auto' });
    }
    
    // Then check if we need to navigate elsewhere
    if (window.location.hash === '#skills') {
        setTimeout(() => {
            const skillsSection = document.querySelector('.second-section');
            if (skillsSection) {
                skillsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    }
});

// Resize handler with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 250);
});

// Characters to use in the rain
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ';
const charSize = 12; // Slightly smaller characters

// Initialize drops for both canvases
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

// Draw the Matrix rain
function drawMatrixRain(ctx, canvas, drops) {
    // Semi-transparent black to create fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text with varying opacity
    for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Calculate position
        const x = i * charSize;
        const y = drops[i] * charSize;

        // Vary the color and opacity based on position
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
        ctx.font = charSize + 'px monospace';

        // Add glow effect
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#0F0';
        
        // Draw the character
        ctx.fillText(char, x, y);
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Move drop down
        drops[i]++;

        // Reset drop to top with random delay
        if (drops[i] * charSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
    }
}

// Animate both rain effects
let animationFrame;
function animate() {
    drawMatrixRain(ctx, canvas, drops);
    drawMatrixRain(skillsCtx, skillsCanvas, skillsDrops);
    drawMatrixRain(aboutCtx, aboutCanvas, aboutDrops);
    animationFrame = requestAnimationFrame(animate);
}
animate();

// Cleanup function
function cleanup() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
}

// Clean up on page unload
window.addEventListener('unload', cleanup);

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Terminal functionality
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const skillsSection = document.querySelector('.second-section');
    const terminalBody = document.querySelector('.terminal-body');
    const floatingTerminal = document.querySelector('.floating-terminal');
    const terminalToggle = document.querySelector('.terminal-toggle');
    const terminalHeader = document.querySelector('.terminal-header');
    
    // Add click event listener to the document to enable music after user interaction
    let hasInteracted = false;
    document.addEventListener('click', function() {
        if (!hasInteracted) {
            hasInteracted = true;
            // Try to play music after user interaction
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
    
    // Make terminal draggable
    if (terminalHeader && floatingTerminal) {
        let isDragging = false;
        let offsetX, offsetY;
        
        terminalHeader.addEventListener('mousedown', function(e) {
            // Only allow dragging from the header, not from the buttons
            if (e.target.closest('.terminal-buttons')) return;
            
            isDragging = true;
            floatingTerminal.classList.add('dragging');
            
            // Calculate the offset of the mouse pointer relative to the terminal
            const rect = floatingTerminal.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            // Prevent text selection during drag
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // Calculate new position
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // Apply new position
            floatingTerminal.style.left = x + 'px';
            floatingTerminal.style.top = y + 'px';
            
            // Remove the fixed right position when dragging
            floatingTerminal.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            floatingTerminal.classList.remove('dragging');
        });
        
        // Ensure terminal stays within viewport
        window.addEventListener('resize', function() {
            if (floatingTerminal.style.display === 'block') {
                const rect = floatingTerminal.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // If terminal is outside viewport, reposition it
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
    
    // Hacking simulation data
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
    
    // Terminal toggle functionality
    if (terminalToggle && floatingTerminal) {
        terminalToggle.addEventListener('click', function() {
            if (floatingTerminal.style.display === 'block') {
                floatingTerminal.style.display = 'none';
            } else {
                floatingTerminal.style.display = 'block';
                terminalInput.focus();
                
                // Pulse effect when opening
                floatingTerminal.style.transition = 'box-shadow 0.5s ease-in-out';
                floatingTerminal.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.7)';
                setTimeout(() => {
                    floatingTerminal.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
                }, 500);
            }
        });
    }
    
    // Fix terminal focus and scrolling
    function setupTerminal() {
        if (!terminalInput || !terminalOutput || !terminalBody) {
            console.warn('Terminal elements not found');
            return;
        }
        
        // Focus terminal input when clicking anywhere in the terminal
        terminalBody.addEventListener('click', function() {
            terminalInput.focus();
        });
        
        // Auto-scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    // Call setup function
    setupTerminal();
    
    // Function to simulate typing effect for hacking
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
    
    // Function to simulate hacking sequence
    async function simulateHacking(target = 'random') {
        // Disable input during simulation
        terminalInput.disabled = true;
        
        // Initial message
        terminalOutput.innerHTML += `<div class="line"><span class="command">Initializing hack sequence on target: ${target}</span></div>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        // Simulate scanning
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Show random messages with delays
        const messageCount = 5 + Math.floor(Math.random() * 5); // 5-9 messages
        const usedIndices = new Set();
        
        for (let i = 0; i < messageCount; i++) {
            // Get random message that hasn't been used yet
            let index;
            do {
                index = Math.floor(Math.random() * hackingMessages.length);
            } while (usedIndices.has(index));
            usedIndices.add(index);
            
            const message = hackingMessages[index];
            
            // Add message with typing effect
            const messageElement = document.createElement('div');
            messageElement.className = 'line';
            terminalOutput.appendChild(messageElement);
            await typeWriter(message, messageElement, 15);
            
            // Random delay between messages
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
            
            // Show code snippet after some messages
            if (i > 0 && Math.random() > 0.5) {
                const codeIndex = Math.floor(Math.random() * hackingCodeSnippets.length);
                const code = hackingCodeSnippets[codeIndex];
                terminalOutput.innerHTML += `<div class="line code">${code}</div>`;
                terminalBody.scrollTop = terminalBody.scrollHeight;
                await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
            }
            
            // Show progress indicator for some messages
            if (Math.random() > 0.7) {
                const progressElement = document.createElement('div');
                progressElement.className = 'line';
                terminalOutput.appendChild(progressElement);
                
                // Create progress bar
                let progress = 0;
                const progressBar = document.createElement('div');
                progressBar.className = 'hack-progress';
                progressBar.innerHTML = '[' + '░'.repeat(20) + '] 0%';
                progressElement.appendChild(progressBar);
                
                // Animate progress bar
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
        
        // Final success message
        await new Promise(resolve => setTimeout(resolve, 1000));
        const resultIndex = Math.floor(Math.random() * hackingResults.length);
        terminalOutput.innerHTML += `<div class="line success">${hackingResults[resultIndex]}</div>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        // Re-enable input
        terminalInput.disabled = false;
        terminalInput.focus();
    }
    
    // Available commands
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
                
                // Start the hacking simulation
                setTimeout(() => {
                    simulateHacking(target);
                }, 300);
                
                return '<div class="line warning">Initiating hack sequence...</div>';
            }
        }
    };
    
    // Process terminal input
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
    
    // Handle terminal input
    if (terminalInput) {
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const input = terminalInput.value;
                
                // Add command to output
                terminalOutput.innerHTML += `<div class="line"><span class="prompt">dark_shadow@system:~$</span> ${input}</div>`;
                
                // Process command
                const result = processCommand(input);
                if (result) {
                    terminalOutput.innerHTML += result;
                }
                
                // Clear input and scroll to bottom
                terminalInput.value = '';
                if (terminalBody) {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            }
        });
    }
    
    // Add terminal buttons functionality
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
    
    // Show terminal toggle hint on page load
    setTimeout(() => {
        if (terminalOutput) {
            terminalOutput.innerHTML += '<div class="line info">Press the terminal button in the top-right corner to toggle the console.</div>';
        }
    }, 2000);
    
    // Get the username element and validate
    const username = document.querySelector('.username');
    if (!username) {
        console.warn('Username element not found');
        return;
    }
    
    // Store original state
    const originalHTML = username.innerHTML;
    const originalStyle = window.getComputedStyle(username);
    
    // Extract text content safely
    const textContent = username.textContent.trim();
    const textParts = textContent.split(/\s+/).filter(part => part && !part.includes(''));
    const originalText = textParts[1] || "Dark_Shadow"; // Get the middle part (the actual username)
    
    // Store icon elements with validation
    const icons = {
        left: '<i class="fas fa-ghost"></i>',
        right: '<i class="fas fa-ghost"></i>'
    };
    
    // Extract icons with better error handling
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
    
    // Improved glitch text generation
    function generateGlitchedText() {
        const glitchChars = "!@#$%^&*()_+{}|:<>?";
        const maxGlitchChars = Math.ceil(originalText.length * 0.3); // Max 30% of chars can be glitched
        let glitchCount = 0;
        
        return originalText.split('').map((char, index) => {
            // Ensure we don't glitch too many characters
            if (glitchCount >= maxGlitchChars) return char;
            
            // Higher chance to glitch middle characters
            const position = index / originalText.length;
            const glitchChance = position > 0.2 && position < 0.8 ? 0.3 : 0.1;
            
            if (Math.random() < glitchChance) {
                glitchCount++;
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
        }).join('');
    }
    
    // Safe content update with validation
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
    
    // Reset content safely
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
    
    // Improved interval management
    let glitchInterval = null;
    let isHovering = false;
    let lastUpdate = 0;
    const updateDelay = 100; // Minimum time between updates
    
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
    
    // Event listeners with error boundaries
    try {
        username.addEventListener('mouseover', startGlitchEffect);
        username.addEventListener('mouseout', stopGlitchEffect);
        username.addEventListener('blur', stopGlitchEffect); // Handle loss of focus
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
    
    // Cleanup on page changes
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
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopGlitchEffect();
        }
    });
    
    // Clean up on page unload
    window.addEventListener('unload', cleanup);
    
    // Handle potential memory leaks
    window.addEventListener('beforeunload', cleanup);

    // Initialize progress bars with animation when scrolled into view
    const progressBars = document.querySelectorAll('.progress');
    const skillsContainer = document.querySelector('.skills-container');
    
    // Function to animate progress bars
    function animateProgressBars() {
        progressBars.forEach(progress => {
            const percent = progress.getAttribute('data-percent');
            progress.style.width = percent + '%';
        });
    }
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Initial check and scroll event listener
    function checkProgressBars() {
        if (skillsSection && isInViewport(skillsSection)) {
            setTimeout(animateProgressBars, 500);
            window.removeEventListener('scroll', checkProgressBars);
        }
    }
    
    // Set initial width to 0
    progressBars.forEach(progress => {
        progress.style.width = '0';
    });
    
    // Check on scroll and initial page load
    window.addEventListener('scroll', checkProgressBars);
    
    // Also trigger animation when navigating to skills via terminal
    commands.skills.action = function() {
        if (skillsSection) {
            setTimeout(() => {
                skillsSection.scrollIntoView({ behavior: 'smooth' });
                // Ensure progress bars animate
                setTimeout(animateProgressBars, 1000);
            }, 500);
            return '<div class="line success">Navigating to skills section...</div>';
        } else {
            return '<div class="line error">Error: Skills section not found.</div>';
        }
    };
    
    // Initial check
    checkProgressBars();

    // Music player elements
    const musicToggle = document.querySelector('.music-toggle');
    const musicInfo = document.querySelector('.music-info');
    const musicTitle = document.querySelector('.music-title');
    const prevButton = document.querySelector('.music-prev');
    const nextButton = document.querySelector('.music-next');
    
    // Update music toggle icon to show as active by default
    if (musicToggle) {
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        musicToggle.classList.add('music-active');
    }
    
    // Music tracks
    const tracks = [
        { element: document.getElementById('bgMusic1'), title: 'Home' },
        { element: document.getElementById('bgMusic2'), title: 'The Nights' },
        { element: document.getElementById('bgMusic3'), title: 'Life Story' },
        { element: document.getElementById('bgMusic4'), title: 'Song 4' }
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false;
    
    // Initialize music player
    function initMusicPlayer() {
        // Set initial volume for all tracks
        tracks.forEach(track => {
            if (track.element) {
                track.element.volume = 0.5;
            }
        });
        
        // Show music info when toggle is clicked
        if (musicToggle) {
            musicToggle.addEventListener('click', toggleMusic);
        }
        
        // Add controls functionality
        if (prevButton) {
            prevButton.addEventListener('click', playPreviousTrack);
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', playNextTrack);
        }
    }
    
    // Function to automatically play music when page loads
    function playMusicAutomatically() {
        setTimeout(() => {
            const currentTrack = tracks[currentTrackIndex].element;
            
            // Try to play the track
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
                console.warn('Auto-play was prevented by the browser. User interaction is required to play audio.', error);
                // We'll show a notification to the user in the terminal
                if (terminalOutput) {
                    terminalOutput.innerHTML += '<div class="line info">Click anywhere on the page to enable music playback.</div>';
                }
            });
        }, 1000);
    }
    
    // Toggle music playback
    function toggleMusic() {
        const currentTrack = tracks[currentTrackIndex].element;
        
        if (!isPlaying) {
            // Start playing
            currentTrack.play().then(() => {
                isPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                musicToggle.classList.add('music-active');
                musicInfo.style.display = 'flex';
                updateMusicInfo();
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        } else {
            // Stop playing
            currentTrack.pause();
            currentTrack.currentTime = 0;
            isPlaying = false;
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicToggle.classList.remove('music-active');
            musicInfo.style.display = 'none';
        }
    }
    
    // Update music info display
    function updateMusicInfo() {
        if (musicTitle) {
            musicTitle.textContent = tracks[currentTrackIndex].title;
        }
    }
    
    // Play previous track
    function playPreviousTrack() {
        if (!isPlaying) return;
        
        // Stop current track
        tracks[currentTrackIndex].element.pause();
        tracks[currentTrackIndex].element.currentTime = 0;
        
        // Switch to previous track
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        
        // Play new track
        tracks[currentTrackIndex].element.play();
        updateMusicInfo();
    }
    
    // Play next track
    function playNextTrack() {
        if (!isPlaying) return;
        
        // Stop current track
        tracks[currentTrackIndex].element.pause();
        tracks[currentTrackIndex].element.currentTime = 0;
        
        // Switch to next track
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        
        // Play new track
        tracks[currentTrackIndex].element.play();
        updateMusicInfo();
    }
    
    // Auto-play next track when current one ends
    function setupTrackEndHandlers() {
        tracks.forEach(track => {
            if (track.element) {
                track.element.addEventListener('ended', () => {
                    playNextTrack();
                });
            }
        });
    }
    
    // Initialize music player
    initMusicPlayer();
    setupTrackEndHandlers();
    
    // Add music commands to terminal
    commands['music'] = {
        description: 'Control music playback (play/pause/next/prev)',
        action: function(args) {
            const subCommand = args[0]?.toLowerCase();
            
            switch (subCommand) {
                case 'play':
                case 'pause':
                    toggleMusic();
                    return '<div class="line success">Toggling music playback...</div>';
                case 'next':
                    playNextTrack();
                    return '<div class="line success">Playing next track...</div>';
                case 'prev':
                    playPreviousTrack();
                    return '<div class="line success">Playing previous track...</div>';
                default:
                    return `<div class="line">Music commands: play/pause, next, prev</div>
                            <div class="line">Current track: ${tracks[currentTrackIndex].title}</div>`;
            }
        }
    };
});




