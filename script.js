class WebCLI {
    constructor() {
        this.commandInput = document.getElementById('command-input');
        this.output = document.getElementById('output');
        this.terminalBody = document.getElementById('terminal-body');
        this.prompt = document.getElementById('prompt');
        this.terminal = document.getElementById('terminal');
        this.terminalHeader = document.getElementById('terminal-header');
        this.statusTime = document.getElementById('status-time');
        
        // File system simulation
        this.currentPath = '/home/user';
        this.fileSystem = {
            '/': {
                type: 'directory',
                contents: {
                    'home': {
                        type: 'directory',
                        contents: {
                                'user': {
                                type: 'directory',
                                contents: {
                                'CREDITS.txt': {
                                    type: 'file',
                                    content: 'This Web CLI Terminal was created by Rajat Malhotra\n\nA web-based command line interface with support for various bash commands.\n\nEnjoy exploring!'
                                },
                                'documents': {
                                    type: 'directory',
                                    contents: {
                                        'readme.txt': { 
                                            type: 'file', 
                                            content: 'Welcome to Web CLI!\n\nThis is a web-based command line interface.\nYou can use various bash commands here.\n\nType "help" to see available commands.'
                                        },
                                        'todo.txt': {
                                            type: 'file',
                                            content: 'TODO List:\n\n1. Learn JavaScript\n2. Build web applications\n3. Master command line\n4. Deploy projects\n5. Write documentation'
                                        },
                                        'poem.txt': {
                                            type: 'file',
                                            content: 'Roses are red,\nViolets are blue,\nWeb CLI is awesome,\nAnd so are you!\n\nCode is poetry,\nTerminals are art,\nWith every command,\nYou play your part.'
                                        }
                                    }
                                },
                                'projects': {
                                    type: 'directory',
                                    contents: {
                                        'web-app': { type: 'directory', contents: {} },
                                        'script.sh': { 
                                            type: 'file', 
                                            content: '#!/bin/bash\n\necho "Hello World"\necho "This is a sample script"\n\nfor i in {1..5}; do\n    echo "Count: $i"\ndone'
                                        },
                                        'config.json': {
                                            type: 'file',
                                            content: '{\n  "name": "web-cli",\n  "version": "1.0.0",\n  "author": "CLI Developer",\n  "settings": {\n    "theme": "dark",\n    "fontSize": 16\n  }\n}'
                                        }
                                    }
                                },
                                'notes.txt': { 
                                    type: 'file', 
                                    content: 'My Personal Notes\n=================\n\nJavaScript Tips:\n- Use const and let instead of var\n- Arrow functions are concise\n- Async/await for promises\n\nBash Commands:\n- ls: list files\n- cat: view file content\n- grep: search in files\n- find: search for files'
                                },
                                'log.txt': {
                                    type: 'file',
                                    content: '[2025-01-01 10:00:00] System started\n[2025-01-01 10:05:23] User logged in\n[2025-01-01 10:15:45] File uploaded\n[2025-01-01 10:30:12] Command executed\n[2025-01-01 11:00:00] System check passed\n[2025-01-01 12:00:00] Backup completed\n[2025-01-01 13:45:30] Error: Connection timeout\n[2025-01-01 14:00:00] System restored\n[2025-01-01 15:30:00] User logged out\n[2025-01-01 16:00:00] System shutdown'
                                }
                                }
                            }
                        }
                    },
                    'etc': {
                        type: 'directory',
                        contents: {
                            'config.conf': { type: 'file', content: 'Configuration file' }
                        }
                    },
                    'var': {
                        type: 'directory',
                        contents: {}
                    }
                }
            }
        };
        
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }
    
    init() {
        this.loadSavedTheme();
        this.printWelcome();
        this.commandInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.terminalBody.addEventListener('click', () => {
             // Only focus if text is not selected
             if (window.getSelection().toString().length === 0) {
                 this.commandInput.focus();
             }
        });
        
        // Button functionality
        document.querySelector('.btn.close').addEventListener('click', () => {
            this.clearOutput();
            this.printLine('Terminal closed. Refresh page to restart.', 'output-error');
            this.commandInput.disabled = true;
        });
        
        document.querySelector('.btn.minimize').addEventListener('click', () => {
            this.terminalBody.style.display = this.terminalBody.style.display === 'none' ? 'block' : 'none';
        });

        document.querySelector('.btn.maximize').addEventListener('click', () => {
            if (this.terminal.style.width === '100vw') {
                // Restore
                this.terminal.style.width = '900px';
                this.terminal.style.height = '600px';
                this.terminal.style.top = '50%';
                this.terminal.style.left = '50%';
                this.terminal.style.transform = 'translate(-50%, -50%)';
            } else {
                // Maximize
                this.terminal.style.width = '100vw';
                this.terminal.style.height = '100vh';
                this.terminal.style.top = '0';
                this.terminal.style.left = '0';
                this.terminal.style.transform = 'none';
            }
        });

        // Initialize UI features
        this.initDraggable();
        this.initResizable();
        this.startClock();
    }

    initDraggable() {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        this.terminalHeader.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('btn')) return; // Don't drag if clicking buttons

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            // Get current position
            const rect = this.terminal.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            // Remove transform centering if it exists to switch to absolute positioning
            this.terminal.style.transform = 'none';
            this.terminal.style.left = `${initialLeft}px`;
            this.terminal.style.top = `${initialTop}px`;
            this.terminal.style.margin = '0';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            this.terminal.style.left = `${initialLeft + dx}px`;
            this.terminal.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    initResizable() {
        const handle = document.querySelector('.resize-handle');
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(this.terminal).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(this.terminal).height, 10);
            e.stopPropagation();
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const width = startWidth + e.clientX - startX;
            const height = startHeight + e.clientY - startY;

            // Min dimensions
            if (width > 400) this.terminal.style.width = width + 'px';
            if (height > 300) this.terminal.style.height = height + 'px';
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            this.statusTime.textContent = now.toLocaleTimeString();
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    printWelcome() {
        this.printLine('╔═══════════════════════════════════════════════════════════╗', 'welcome-message');
        this.printLine('║         Welcome to Web-based CLI Terminal v1.0          ║', 'welcome-message');
        this.printLine('║                                                          ║', 'welcome-message');
        this.printLine('║  Type "help" to see available commands                  ║', 'welcome-message');
        this.printLine('╚═══════════════════════════════════════════════════════════╝', 'welcome-message');
        this.printLine('');
    }
    
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            const command = this.commandInput.value.trim();
            if (command) {
                this.executeCommand(command);
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
            }
            this.commandInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.commandInput.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.commandInput.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.commandInput.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Basic tab completion (can be expanded)
            const input = this.commandInput.value;
            const commands = Object.keys(this.commands);
            const matches = commands.filter(cmd => cmd.startsWith(input));
            if (matches.length === 1) {
                this.commandInput.value = matches[0];
            }
        }
    }
    
    executeCommand(input) {
        const commandLine = `${this.prompt.textContent} ${input}`;
        this.printLine(commandLine, 'output-command');
        
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        if (this.commands[command]) {
            this.commands[command].call(this, args);
        } else {
            this.printLine(`bash: ${command}: command not found`, 'output-error');
        }
        
        this.scrollToBottom();
    }
    
    commands = {
        help: function() {
            this.printLine('Available commands:\n', 'help-table');
            const commandList = [
                ['help', 'Display this help message'],
                ['clear', 'Clear the terminal screen'],
                ['ls [-l] [-a]', 'List directory contents'],
                ['pwd', 'Print working directory'],
                ['cd [dir]', 'Change directory'],
                ['mkdir [name]', 'Create a new directory'],
                ['touch [file]', 'Create a new file'],
                ['cat [options] [file]', 'Display file contents (-n, -E, -T, -A, -s)'],
                ['echo [options] [text]', 'Display a line of text (-n, -e)'],
                ['rm [-r] [file/dir]', 'Remove file or directory'],
                ['cp [source] [dest]', 'Copy files or directories'],
                ['mv [source] [dest]', 'Move/rename files or directories'],
                ['grep [pattern] [file]', 'Search for pattern in file'],
                ['wc [file]', 'Count lines, words, and characters'],
                ['head [-n] [file]', 'Display first lines of file'],
                ['tail [-n] [file]', 'Display last lines of file'],
                ['find [name]', 'Search for files in directory'],
                ['date', 'Display current date and time'],
                ['whoami', 'Display current user'],
                ['history', 'Show command history'],
                ['tree', 'Display directory tree'],
                ['uname [-a]', 'Display system information'],
                ['fetch', 'Display system information with ASCII art'],
                ['todo [add/rm/list]', 'Manage todo list'],
                ['calc [expression]', 'Calculate mathematical expression'],
                ['weather [city]', 'Check current weather'],
                ['matrix', 'Enter the matrix (screensaver)'],
                ['dragon-slayer', 'Start the Dragon Slayer RPG game'],
                ['theme', 'Change terminal theme (use arrow keys to select)']
            ];
            
            commandList.forEach(([cmd, desc]) => {
                this.printLine(`  <span class="help-command">${cmd.padEnd(20)}</span>${desc}`);
            });
        },
        
        clear: function() {
            this.output.innerHTML = '';
        },
        
        'dragon-slayer': function() {
            this.startDragonSlayer();
        },
        
        theme: function() {
            this.showThemeSelector();
        },

        fetch: function() {
            const logo = [
                '   _    _      _      ___ _    ___ ',
                '  | |  | |    | |    / __| |  |_ _|',
                '  | |/\\| | ___| |__ | (__| |__ | | ',
                '  |__/\\__|_/___|_.__|\\___|____|___|',
                '                                   '
            ];

            const info = [
                `<span style="color: var(--prompt-color); font-weight: bold;">user@webcli</span>`,
                `------------------`,
                `<span style="color: var(--text-color);">OS</span>: ${navigator.platform}`,
                `<span style="color: var(--text-color);">Host</span>: Web Browser`,
                `<span style="color: var(--text-color);">Browser</span>: ${navigator.userAgent.split(' ')[0]}`,
                `<span style="color: var(--text-color);">Resolution</span>: ${window.screen.width}x${window.screen.height}`,
                `<span style="color: var(--text-color);">Date</span>: ${new Date().toLocaleDateString()}`
            ];

            // Add theme info if available
            try {
                const savedTheme = JSON.parse(localStorage.getItem('cli-theme'));
                if (savedTheme) {
                    info.push(`<span style="color: var(--text-color);">Theme</span>: ${savedTheme.name}`);
                }
            } catch(e) {}

            let output = '<div style="display: flex; gap: 20px; margin: 10px 0;">';

            // Logo column
            output += '<div style="color: var(--directory-color); font-weight: bold; line-height: 1.2;">';
            output += logo.join('\n').replace(/ /g, '&nbsp;');
            output += '</div>';

            // Info column
            output += '<div style="line-height: 1.2;">';
            info.forEach(line => output += line + '\n');

            // Color palette
            output += '\n<div style="display: flex; gap: 5px; margin-top: 5px;">';
            ['#000000', '#ff5555', '#50fa7b', '#f1fa8c', '#bd93f9', '#ff79c6', '#8be9fd', '#ffffff'].forEach(color => {
                output += `<span style="display: inline-block; width: 12px; height: 12px; background: ${color}; border-radius: 2px;"></span>`;
            });
            output += '</div></div></div>';

            this.printLine(output);
        },

        todo: function(args) {
            if (args.length === 0 || args[0] === 'list') {
                const todos = JSON.parse(localStorage.getItem('cli-todos') || '[]');
                if (todos.length === 0) {
                    this.printLine('No todos found. Use "todo add <task>" to create one.');
                    return;
                }
                this.printLine('TODO List:', 'directory');
                todos.forEach((todo, index) => {
                    const status = todo.done ? '[x]' : '[ ]';
                    const style = todo.done ? 'color: #00ff00; text-decoration: line-through;' : '';
                    this.printLine(`${index + 1}. <span style="${style}">${status} ${todo.text}</span>`);
                });
            } else if (args[0] === 'add') {
                const text = args.slice(1).join(' ');
                if (!text) {
                    this.printLine('Usage: todo add <task>', 'output-error');
                    return;
                }
                const todos = JSON.parse(localStorage.getItem('cli-todos') || '[]');
                todos.push({ text, done: false });
                localStorage.setItem('cli-todos', JSON.stringify(todos));
                this.printLine(`Added task: "${text}"`);
            } else if (args[0] === 'rm') {
                const index = parseInt(args[1]) - 1;
                const todos = JSON.parse(localStorage.getItem('cli-todos') || '[]');
                if (isNaN(index) || index < 0 || index >= todos.length) {
                    this.printLine('Usage: todo rm <id>', 'output-error');
                    return;
                }
                const removed = todos.splice(index, 1);
                localStorage.setItem('cli-todos', JSON.stringify(todos));
                this.printLine(`Removed task: "${removed[0].text}"`);
            } else if (args[0] === 'done') {
                const index = parseInt(args[1]) - 1;
                const todos = JSON.parse(localStorage.getItem('cli-todos') || '[]');
                if (isNaN(index) || index < 0 || index >= todos.length) {
                    this.printLine('Usage: todo done <id>', 'output-error');
                    return;
                }
                todos[index].done = !todos[index].done; // Toggle
                localStorage.setItem('cli-todos', JSON.stringify(todos));
                this.printLine(`Marked task as ${todos[index].done ? 'done' : 'pending'}: "${todos[index].text}"`);
            } else {
                this.printLine('Usage: todo [add|list|rm|done] ...', 'output-error');
            }
        },

        calc: function(args) {
            if (args.length === 0) {
                this.printLine('Usage: calc [expression]', 'output-error');
                return;
            }
            const expression = args.join(' ');
            try {
                // simple and relatively safe evaluation for a client-side tool
                // allowing Math. functions as well
                const result = new Function('return ' + expression)();
                this.printLine(`${result}`);
            } catch (e) {
                this.printLine(`Error: ${e.message}`, 'output-error');
            }
        },

        weather: async function(args) {
            const city = args.join('+') || '';
            if (!city) {
                this.printLine('Usage: weather [city]', 'output-error');
                return;
            }

            this.printLine(`Fetching weather for ${city}...`);

            try {
                const response = await fetch(`https://wttr.in/${city}?0AT`);
                if (!response.ok) throw new Error('Weather service unavailable');
                const text = await response.text();
                if (!text.trim()) throw new Error('Empty response');
                this.printLine(text);
                this.scrollToBottom();
            } catch (error) {
                this.printLine(`Error: ${error.message}`, 'output-error');
                this.printLine('Falling back to simulation:', 'game-description');
                this.printLine(`Weather in ${args.join(' ')}: 🌤️  Sunny, 25°C`, 'game-success');
                this.scrollToBottom();
            }
        },

        matrix: function() {
            const canvas = document.createElement('canvas');
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.zIndex = '9999';
            canvas.style.background = 'black';
            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
            const fontSize = 16;
            const columns = canvas.width / fontSize;
            const drops = Array(Math.floor(columns)).fill(1);

            let intervalId;

            // Allow this context to be accessed inside cleanup
            const self = this;

            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#0F0';
                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const text = letters.charAt(Math.floor(Math.random() * letters.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }

            intervalId = setInterval(draw, 33);

            const cleanup = () => {
                clearInterval(intervalId);
                canvas.remove();
                document.removeEventListener('keydown', cleanup);
                document.removeEventListener('click', cleanup);
                self.commandInput.focus();
            };

            document.addEventListener('keydown', cleanup);
            document.addEventListener('click', cleanup);
        },
        
        ls: function(args) {
            const currentDir = this.getCurrentDirectory();
            if (!currentDir || !currentDir.contents) {
                this.printLine('ls: cannot access directory', 'output-error');
                return;
            }
            
            const items = Object.keys(currentDir.contents);
            if (items.length === 0) {
                return;
            }
            
            if (args.includes('-l')) {
                // Long format
                items.forEach(item => {
                    const entry = currentDir.contents[item];
                    const type = entry.type === 'directory' ? 'd' : '-';
                    const size = entry.type === 'file' ? (entry.content ? entry.content.length : 0) : 4096;
                    const date = new Date().toLocaleDateString();
                    const color = entry.type === 'directory' ? 'directory' : 'file';
                    this.printLine(`${type}rwxr-xr-x  1 user user ${size.toString().padStart(8)} ${date} <span class="${color}">${item}</span>`);
                });
            } else {
                // Grid format
                let output = '<div class="file-list">';
                items.forEach(item => {
                    const entry = currentDir.contents[item];
                    const className = entry.type === 'directory' ? 'directory' : 'file';
                    output += `<span class="${className}">${item}${entry.type === 'directory' ? '/' : ''}</span>`;
                });
                output += '</div>';
                this.output.innerHTML += output;
            }
        },
        
        pwd: function() {
            this.printLine(this.currentPath);
        },
        
        cd: function(args) {
            if (args.length === 0 || args[0] === '~') {
                this.currentPath = '/home/user';
                this.updatePrompt();
                return;
            }
            
            const targetPath = args[0];
            
            if (targetPath === '..') {
                const parts = this.currentPath.split('/').filter(p => p);
                if (parts.length > 0) {
                    parts.pop();
                    this.currentPath = '/' + parts.join('/');
                    if (this.currentPath === '/') this.currentPath = '/';
                }
                this.updatePrompt();
                return;
            }
            
            if (targetPath === '/') {
                this.currentPath = '/';
                this.updatePrompt();
                return;
            }
            
            const newPath = targetPath.startsWith('/') 
                ? targetPath 
                : this.currentPath + '/' + targetPath;
            
            const dir = this.getDirectoryAtPath(newPath);
            if (dir && dir.type === 'directory') {
                this.currentPath = newPath.replace(/\/+/g, '/');
                this.updatePrompt();
            } else {
                this.printLine(`cd: ${targetPath}: No such file or directory`, 'output-error');
            }
        },
        
        mkdir: function(args) {
            if (args.length === 0) {
                this.printLine('mkdir: missing operand', 'output-error');
                return;
            }
            
            const dirName = args[0];
            const currentDir = this.getCurrentDirectory();
            
            if (currentDir.contents[dirName]) {
                this.printLine(`mkdir: cannot create directory '${dirName}': File exists`, 'output-error');
                return;
            }
            
            currentDir.contents[dirName] = {
                type: 'directory',
                contents: {}
            };
            
            this.printLine(`Created directory: ${dirName}`);
        },
        
        touch: function(args) {
            if (args.length === 0) {
                this.printLine('touch: missing file operand', 'output-error');
                return;
            }
            
            const fileName = args[0];
            const currentDir = this.getCurrentDirectory();
            
            if (!currentDir.contents[fileName]) {
                currentDir.contents[fileName] = {
                    type: 'file',
                    content: ''
                };
                this.printLine(`Created file: ${fileName}`);
            } else {
                this.printLine(`File already exists: ${fileName}`);
            }
        },
        
        cat: function(args) {
            // Parse flags
            const flags = args.filter(arg => arg.startsWith('-'));
            const files = args.filter(arg => !arg.startsWith('-'));
            
            const showLineNumbers = flags.includes('-n');
            const showEnds = flags.includes('-e') || flags.includes('-E');
            const showTabs = flags.includes('-t') || flags.includes('-T');
            const showAll = flags.includes('-A');
            const squeeze = flags.includes('-s');
            
            if (files.length === 0) {
                this.printLine('cat: missing file operand', 'output-error');
                this.printLine('Try \'cat --help\' for more information.');
                return;
            }
            
            if (args.includes('--help')) {
                this.printLine('Usage: cat [OPTION]... [FILE]...');
                this.printLine('Concatenate FILE(s) to standard output.\n');
                this.printLine('Options:');
                this.printLine('  -n    number all output lines');
                this.printLine('  -E    display $ at end of each line');
                this.printLine('  -T    display TAB characters as ^I');
                this.printLine('  -A    equivalent to -ET');
                this.printLine('  -s    suppress repeated empty output lines');
                return;
            }
            
            const currentDir = this.getCurrentDirectory();
            
            files.forEach((fileName, fileIndex) => {
                const file = currentDir.contents[fileName];
                
                if (!file) {
                    this.printLine(`cat: ${fileName}: No such file or directory`, 'output-error');
                    return;
                }
                
                if (file.type !== 'file') {
                    this.printLine(`cat: ${fileName}: Is a directory`, 'output-error');
                    return;
                }
                
                let content = file.content || '';
                let lines = content.split('\n');
                
                // Squeeze blank lines
                if (squeeze) {
                    lines = lines.reduce((acc, line, i) => {
                        if (line.trim() === '' && acc.length > 0 && acc[acc.length - 1].trim() === '') {
                            return acc;
                        }
                        acc.push(line);
                        return acc;
                    }, []);
                }
                
                lines.forEach((line, i) => {
                    let output = line;
                    
                    // Show tabs
                    if (showTabs || showAll) {
                        output = output.replace(/\t/g, '^I');
                    }
                    
                    // Show line endings
                    if (showEnds || showAll) {
                        output += '$';
                    }
                    
                    // Show line numbers
                    if (showLineNumbers) {
                        output = `${(i + 1).toString().padStart(6)}  ${output}`;
                    }
                    
                    this.printLine(output);
                });
                
                // Add separator between multiple files
                if (files.length > 1 && fileIndex < files.length - 1) {
                    this.printLine('');
                }
            });
        },
        
        echo: function(args) {
            if (args.includes('--help')) {
                this.printLine('Usage: echo [SHORT-OPTION]... [STRING]...');
                this.printLine('Echo the STRING(s) to standard output.\n');
                this.printLine('  -n    do not output the trailing newline');
                this.printLine('  -e    enable interpretation of backslash escapes');
                return;
            }
            
            const noNewline = args.includes('-n');
            const interpret = args.includes('-e');
            let filteredArgs = args.filter(arg => !arg.startsWith('-'));
            
            let output = filteredArgs.join(' ');
            
            if (interpret) {
                output = output
                    .replace(/\\\\n/g, '\n')
                    .replace(/\\\\t/g, '\t')
                    .replace(/\\\\r/g, '\r')
                    .replace(/\\\\'/g, "'")
                    .replace(/\\\\\"/g, '"')
                    .replace(/\\\\\\\\/g, '\\');
            }
            
            this.printLine(output);
        },
        
        rm: function(args) {
            if (args.length === 0) {
                this.printLine('rm: missing operand', 'output-error');
                return;
            }
            
            const name = args[0];
            const currentDir = this.getCurrentDirectory();
            
            if (!currentDir.contents[name]) {
                this.printLine(`rm: cannot remove '${name}': No such file or directory`, 'output-error');
                return;
            }
            
            if (currentDir.contents[name].type === 'directory' && !args.includes('-r')) {
                this.printLine(`rm: cannot remove '${name}': Is a directory (use -r for recursive)`, 'output-error');
                return;
            }
            
            delete currentDir.contents[name];
            this.printLine(`Removed: ${name}`);
        },
        
        date: function() {
            const now = new Date();
            this.printLine(now.toString());
        },
        
        whoami: function() {
            this.printLine('user');
        },
        
        history: function() {
            this.commandHistory.forEach((cmd, index) => {
                this.printLine(`${(index + 1).toString().padStart(4)} ${cmd}`);
            });
        },
        
        tree: function() {
            const printTree = (dir, prefix = '', isLast = true) => {
                const entries = Object.entries(dir.contents || {});
                entries.forEach(([name, entry], index) => {
                    const isLastEntry = index === entries.length - 1;
                    const marker = isLastEntry ? '└── ' : '├── ';
                    const className = entry.type === 'directory' ? 'directory' : 'file';
                    this.printLine(`${prefix}${marker}<span class="${className}">${name}</span>`);
                    
                    if (entry.type === 'directory') {
                        const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
                        printTree(entry, newPrefix, isLastEntry);
                    }
                });
            };
            
            const currentDir = this.getCurrentDirectory();
            this.printLine('.');
            printTree(currentDir);
        },
        
        uname: function(args) {
            if (args.includes('-a')) {
                this.printLine('WebCLI 1.0.0 web-terminal x86_64 Browser/OS');
            } else {
                this.printLine('WebCLI');
            }
        },
        
        cp: function(args) {
            if (args.length < 2) {
                this.printLine('cp: missing file operand', 'output-error');
                this.printLine('Usage: cp [source] [destination]');
                return;
            }
            
            const source = args[0];
            const dest = args[1];
            const recursive = args.includes('-r');
            const currentDir = this.getCurrentDirectory();
            
            const sourceItem = currentDir.contents[source];
            
            if (!sourceItem) {
                this.printLine(`cp: cannot stat '${source}': No such file or directory`, 'output-error');
                return;
            }
            
            if (sourceItem.type === 'directory' && !recursive) {
                this.printLine(`cp: -r not specified; omitting directory '${source}'`, 'output-error');
                return;
            }
            
            // Deep copy the item
            const copy = JSON.parse(JSON.stringify(sourceItem));
            currentDir.contents[dest] = copy;
            this.printLine(`'${source}' -> '${dest}'`);
        },
        
        mv: function(args) {
            if (args.length < 2) {
                this.printLine('mv: missing file operand', 'output-error');
                this.printLine('Usage: mv [source] [destination]');
                return;
            }
            
            const source = args[0];
            const dest = args[1];
            const currentDir = this.getCurrentDirectory();
            
            const sourceItem = currentDir.contents[source];
            
            if (!sourceItem) {
                this.printLine(`mv: cannot stat '${source}': No such file or directory`, 'output-error');
                return;
            }
            
            currentDir.contents[dest] = sourceItem;
            delete currentDir.contents[source];
            this.printLine(`'${source}' -> '${dest}'`);
        },
        
        grep: function(args) {
            if (args.length < 2) {
                this.printLine('grep: missing operand', 'output-error');
                this.printLine('Usage: grep [pattern] [file]');
                return;
            }
            
            const pattern = args[0];
            const fileName = args[1];
            const ignoreCase = args.includes('-i');
            const lineNumbers = args.includes('-n');
            const invert = args.includes('-v');
            
            const currentDir = this.getCurrentDirectory();
            const file = currentDir.contents[fileName];
            
            if (!file) {
                this.printLine(`grep: ${fileName}: No such file or directory`, 'output-error');
                return;
            }
            
            if (file.type !== 'file') {
                this.printLine(`grep: ${fileName}: Is a directory`, 'output-error');
                return;
            }
            
            const content = file.content || '';
            const lines = content.split('\n');
            let regex;
            
            try {
                regex = new RegExp(pattern, ignoreCase ? 'i' : '');
            } catch (e) {
                this.printLine(`grep: invalid pattern`, 'output-error');
                return;
            }
            
            let matchCount = 0;
            lines.forEach((line, index) => {
                const matches = regex.test(line);
                const shouldPrint = invert ? !matches : matches;
                
                if (shouldPrint) {
                    matchCount++;
                    let output = line;
                    if (lineNumbers) {
                        output = `${index + 1}:${line}`;
                    }
                    // Highlight matched text
                    if (!invert) {
                        output = output.replace(regex, match => `<span style="color: #ff6b6b; font-weight: bold;">${match}</span>`);
                    }
                    this.printLine(output);
                }
            });
            
            if (matchCount === 0) {
                this.printLine(`grep: no matches found`, 'output-error');
            }
        },
        
        wc: function(args) {
            if (args.length === 0) {
                this.printLine('wc: missing file operand', 'output-error');
                return;
            }
            
            const fileName = args[0];
            const lines = args.includes('-l');
            const words = args.includes('-w');
            const chars = args.includes('-c');
            const showAll = !lines && !words && !chars;
            
            const currentDir = this.getCurrentDirectory();
            const file = currentDir.contents[fileName];
            
            if (!file) {
                this.printLine(`wc: ${fileName}: No such file or directory`, 'output-error');
                return;
            }
            
            if (file.type !== 'file') {
                this.printLine(`wc: ${fileName}: Is a directory`, 'output-error');
                return;
            }
            
            const content = file.content || '';
            const lineCount = content.split('\n').length;
            const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
            const charCount = content.length;
            
            let output = '';
            if (showAll || lines) output += lineCount.toString().padStart(8);
            if (showAll || words) output += wordCount.toString().padStart(8);
            if (showAll || chars) output += charCount.toString().padStart(8);
            output += ` ${fileName}`;
            
            this.printLine(output);
        },
        
        head: function(args) {
            if (args.filter(a => !a.startsWith('-')).length === 0) {
                this.printLine('head: missing file operand', 'output-error');
                return;
            }
            
            let numLines = 10;
            let fileName;
            
            // Parse -n flag
            for (let i = 0; i < args.length; i++) {
                if (args[i] === '-n' && i + 1 < args.length) {
                    numLines = parseInt(args[i + 1]);
                    i++;
                } else if (!args[i].startsWith('-')) {
                    fileName = args[i];
                }
            }
            
            const currentDir = this.getCurrentDirectory();
            const file = currentDir.contents[fileName];
            
            if (!file) {
                this.printLine(`head: ${fileName}: No such file or directory`, 'output-error');
                return;
            }
            
            if (file.type !== 'file') {
                this.printLine(`head: ${fileName}: Is a directory`, 'output-error');
                return;
            }
            
            const content = file.content || '';
            const lines = content.split('\n');
            const output = lines.slice(0, numLines).join('\n');
            this.printLine(output);
        },
        
        tail: function(args) {
            if (args.filter(a => !a.startsWith('-')).length === 0) {
                this.printLine('tail: missing file operand', 'output-error');
                return;
            }
            
            let numLines = 10;
            let fileName;
            
            // Parse -n flag
            for (let i = 0; i < args.length; i++) {
                if (args[i] === '-n' && i + 1 < args.length) {
                    numLines = parseInt(args[i + 1]);
                    i++;
                } else if (!args[i].startsWith('-')) {
                    fileName = args[i];
                }
            }
            
            const currentDir = this.getCurrentDirectory();
            const file = currentDir.contents[fileName];
            
            if (!file) {
                this.printLine(`tail: ${fileName}: No such file or directory`, 'output-error');
                return;
            }
            
            if (file.type !== 'file') {
                this.printLine(`tail: ${fileName}: Is a directory`, 'output-error');
                return;
            }
            
            const content = file.content || '';
            const lines = content.split('\n');
            const output = lines.slice(-numLines).join('\n');
            this.printLine(output);
        },
        
        find: function(args) {
            const searchName = args[0] || '';
            
            const searchRecursive = (dir, path = '') => {
                const results = [];
                
                Object.entries(dir.contents || {}).forEach(([name, entry]) => {
                    const fullPath = path + '/' + name;
                    
                    if (searchName === '' || name.includes(searchName)) {
                        results.push(fullPath);
                    }
                    
                    if (entry.type === 'directory') {
                        results.push(...searchRecursive(entry, fullPath));
                    }
                });
                
                return results;
            };
            
            const currentDir = this.getCurrentDirectory();
            const results = searchRecursive(currentDir, '.');
            
            if (results.length === 0) {
                this.printLine('find: no files found');
            } else {
                results.forEach(result => this.printLine(result));
            }
        }
    };
    
    getCurrentDirectory() {
        return this.getDirectoryAtPath(this.currentPath);
    }
    
    getDirectoryAtPath(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        
        for (const part of parts) {
            if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return null;
            }
        }
        
        return current;
    }
    
    updatePrompt() {
        const shortPath = this.currentPath === '/home/user' 
            ? '~' 
            : this.currentPath.replace('/home/user', '~');
        this.prompt.textContent = `user@webcli:${shortPath}$`;

        // Update status bar too
        const statusLocation = document.getElementById('status-location');
        if (statusLocation) statusLocation.textContent = this.currentPath;
    }
    
    printLine(text, className = 'output-result') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.innerHTML = text;
        this.output.appendChild(line);
    }
    
    clearOutput() {
        this.output.innerHTML = '';
    }
    
    scrollToBottom() {
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    }
    
    // Dragon Slayer RPG Game
    startDragonSlayer() {
        this.gameState = {
            player: {
                name: '',
                health: 100,
                maxHealth: 100,
                stamina: 100,
                maxStamina: 100,
                gold: 50,
                experience: 0,
                level: 1,
                attack: 10,
                defense: 5,
                inventory: ['Rusty Sword', 'Leather Armor', 'Health Potion'],
                equipped: { weapon: 'Rusty Sword', armor: 'Leather Armor' },
                dragonKills: 0
            },
            location: 'intro',
            inGame: true,
            flags: {
                metBlacksmith: false,
                metWizard: false,
                exploredCave: false
            }
        };
        
        this.gameItems = {
            'Rusty Sword': { type: 'weapon', attack: 10, value: 20 },
            'Iron Sword': { type: 'weapon', attack: 20, value: 100 },
            'Dragon Blade': { type: 'weapon', attack: 40, value: 500 },
            'Leather Armor': { type: 'armor', defense: 5, value: 30 },
            'Steel Armor': { type: 'armor', defense: 15, value: 150 },
            'Dragon Scale Armor': { type: 'armor', defense: 30, value: 800 },
            'Health Potion': { type: 'consumable', healAmount: 40, value: 25 },
            'Greater Health Potion': { type: 'consumable', healAmount: 80, value: 60 },
            'Stamina Elixir': { type: 'consumable', staminaAmount: 50, value: 30 }
        };
        
        this.gameEnemies = {
            'Forest Wolf': { health: 30, attack: 8, defense: 2, gold: 15, exp: 20 },
            'Mountain Bandit': { health: 45, attack: 12, defense: 5, gold: 30, exp: 35 },
            'Cave Troll': { health: 80, attack: 18, defense: 8, gold: 50, exp: 60 },
            'Lesser Dragon': { health: 150, attack: 25, defense: 12, gold: 200, exp: 150 },
            'Ancient Dragon King': { health: 500, attack: 60, defense: 30, gold: 1000, exp: 600 }
        };
        
        this.commandInput.disabled = true;
        this.gameIntro();
    }
    
    gameIntro() {
        this.printLine('');
        this.printLine('╔═══════════════════════════════════════════════════════╗', 'game-banner');
        this.printLine('║         🐉 THE DRAGON SLAYER 🗡️                      ║', 'game-banner');
        this.printLine('╚═══════════════════════════════════════════════════════╝', 'game-banner');
        this.printLine('');
        this.printLine('<span class="game-story">In the Kingdom of Aethermoor, darkness spreads across the land...</span>');
        this.printLine('<span class="game-story">Dragons, once sleeping in ancient mountains, have awakened.</span>');
        this.printLine('<span class="game-story">Villages burn. People flee. Hope fades.</span>');
        this.printLine('');
        this.printLine('<span class="game-story">But legends speak of a hero...</span>');
        this.printLine('');
        
        setTimeout(() => {
            this.gameAskName();
        }, 2000);
    }
    
    gameAskName() {
        this.printLine('<span class="game-question">What is your name, brave warrior?</span>');
        this.printLine('<span class="game-hint">[Type your name and press Enter]</span>');
        
        this.commandInput.disabled = false;
        this.commandInput.focus();
        this.gameWaitingForName = true;
        
        const originalKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyPress = (e) => {
            if (e.key === 'Enter' && this.gameWaitingForName) {
                const name = this.commandInput.value.trim() || 'Dragonslayer';
                this.gameState.player.name = name;
                this.printLine(`> ${name}`, 'output-command');
                this.commandInput.value = '';
                this.gameWaitingForName = false;
                this.handleKeyPress = originalKeyPress;
                this.gameStartAdventure();
            } else if (!this.gameWaitingForName) {
                originalKeyPress(e);
            }
        };
    }
    
    gameStartAdventure() {
        this.printLine('');
        this.printLine(`<span class="game-story">Welcome, <strong>${this.gameState.player.name}</strong>.</span>`);
        this.printLine('<span class="game-story">Your journey begins in the village of Thornhaven...</span>');
        this.printLine('<span class="game-story">The villagers look to you with desperate hope.</span>');
        this.printLine('');
        
        setTimeout(() => {
            this.gameShowVillage();
        }, 2000);
    }
    
    gameShowVillage() {
        this.gameState.location = 'village';
        this.commandInput.disabled = false;
        
        this.printLine('');
        this.printLine('╔═══════════════════════════════════════════════════════╗', 'game-location');
        this.printLine('║         🏘️  VILLAGE OF THORNHAVEN                    ║', 'game-location');
        this.printLine('╚═══════════════════════════════════════════════════════╝', 'game-location');
        this.printLine('');
        this.printLine('<span class="game-description">You stand in the village square. Smoke rises from chimneys.</span>');
        this.printLine('<span class="game-description">An undercurrent of fear fills the air...</span>');
        this.printLine('');
        this.gameShowOptions([
            '1. 🗣️  Talk to villagers',
            '2. 🏪 Visit the shop',
            '3. ⚒️  Visit the blacksmith',
            '4. 🧙 Visit the wizard',
            '5. 🎒 Check inventory',
            '6. 📊 View stats',
            '7. 🗺️  Explore the world',
            '0. 🚪 Exit game'
        ]);
    }
    
    gameShowOptions(options) {
        options.forEach(opt => this.printLine(`<span class="game-option">${opt}</span>`));
        this.printLine('');
        this.printLine('<span class="game-hint">[Enter a number to choose]</span>');
        
        this.gameCurrentOptions = options;
        this.commandInput.focus();
        this.gameWaitingForChoice = true;
        
        const originalKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyPress = (e) => {
            if (e.key === 'Enter' && this.gameWaitingForChoice && this.gameState.inGame) {
                const choice = this.commandInput.value.trim();
                this.printLine(`> ${choice}`, 'output-command');
                this.commandInput.value = '';
                this.gameWaitingForChoice = false;
                this.handleKeyPress = originalKeyPress;
                this.gameHandleChoice(choice);
            } else if (!this.gameWaitingForChoice && !this.gameState.inGame) {
                originalKeyPress(e);
            }
        };
    }
    
    gameHandleChoice(choice) {
        if (this.gameState.location === 'village') {
            switch(choice) {
                case '1': this.gameTalkToVillagers(); break;
                case '2': this.gameShop(); break;
                case '3': this.gameBlacksmith(); break;
                case '4': this.gameWizard(); break;
                case '5': this.gameInventory(); break;
                case '6': this.gameShowStats(); break;
                case '7': this.gameWorldMap(); break;
                case '0': this.gameExit(); break;
                default: 
                    this.printLine('<span class="output-error">Invalid choice. Please try again.</span>');
                    this.gameShowVillage();
            }
        } else if (this.gameState.location === 'worldmap') {
            this.gameHandleWorldMapChoice(choice);
        } else if (this.gameState.location === 'combat') {
            this.gameHandleCombatChoice(choice);
        } else if (this.gameState.location === 'shop') {
            this.gameHandleShopChoice(choice);
        }
    }
    
    gameTalkToVillagers() {
        const dialogues = [
            '👴 Elder: "A dragon was spotted near the old cave. Please, be careful!"',
            '🌾 Farmer: "My crops are withering... I fear the dragon\'s curse."',
            '👶 Child: "Are you really going to slay the dragon? You\'re so brave!"',
            '🏪 Merchant: "I heard the Ancient Dragon King dwells in the Volcanic Peak..."'
        ];
        
        const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
        this.printLine('');
        this.printLine(`<span class="game-npc">${dialogue}</span>`);
        this.printLine('');
        
        setTimeout(() => this.gameShowVillage(), 1500);
    }
    
    gameShop() {
        this.gameState.location = 'shop';
        this.printLine('');
        this.printLine('╔═══════════════════════════════════════════════════════╗', 'game-location');
        this.printLine('║         🏪 VILLAGE SHOP                               ║', 'game-location');
        this.printLine('╚═══════════════════════════════════════════════════════╝', 'game-location');
        this.printLine('');
        this.printLine(`<span class="game-gold">Your Gold: ${this.gameState.player.gold}💰</span>`);
        this.printLine('');
        
        const shopItems = ['Iron Sword', 'Steel Armor', 'Health Potion', 'Greater Health Potion', 'Stamina Elixir'];
        const options = shopItems.map((item, i) => {
            const itemData = this.gameItems[item];
            return `${i + 1}. ${item} - ${itemData.value}💰`;
        });
        options.push('0. Leave shop');
        
        this.gameShowOptions(options);
    }
    
    gameHandleShopChoice(choice) {
        const shopItems = ['Iron Sword', 'Steel Armor', 'Health Potion', 'Greater Health Potion', 'Stamina Elixir'];
        const itemIndex = parseInt(choice) - 1;
        
        if (choice === '0') {
            this.gameShowVillage();
        } else if (itemIndex >= 0 && itemIndex < shopItems.length) {
            const item = shopItems[itemIndex];
            const itemData = this.gameItems[item];
            
            if (this.gameState.player.gold >= itemData.value) {
                this.gameState.player.gold -= itemData.value;
                this.gameState.player.inventory.push(item);
                this.printLine(`<span class="game-success">✅ Purchased ${item}!</span>`);
                this.printLine('');
                setTimeout(() => this.gameShop(), 1000);
            } else {
                this.printLine('<span class="output-error">❌ Not enough gold!</span>');
                this.printLine('');
                setTimeout(() => this.gameShop(), 1000);
            }
        } else {
            this.printLine('<span class="output-error">Invalid choice.</span>');
            this.gameShop();
        }
    }
    
    gameBlacksmith() {
        this.printLine('');
        this.printLine('⚒️  <span class="game-location">BLACKSMITH</span>');
        this.printLine('');
        
        if (!this.gameState.flags.metBlacksmith) {
            this.printLine('<span class="game-npc">Blacksmith: "Ah, a dragon slayer! I can forge better equipment..."</span>');
            this.printLine('<span class="game-npc">Blacksmith: "But I need rare materials. Bring me dragon scales!"</span>');
            this.gameState.flags.metBlacksmith = true;
        } else if (this.gameState.player.dragonKills >= 2) {
            this.printLine('<span class="game-npc">Blacksmith: "Excellent! Let me craft something special..."</span>');
            if (!this.gameState.player.inventory.includes('Dragon Blade')) {
                this.gameState.player.inventory.push('Dragon Blade');
                this.printLine('<span class="game-reward">🎁 Received: Dragon Blade!</span>');
            }
        } else {
            this.printLine('<span class="game-npc">Blacksmith: "Come back when you\'ve proven yourself."</span>');
        }
        
        this.printLine('');
        setTimeout(() => this.gameShowVillage(), 2000);
    }
    
    gameWizard() {
        this.printLine('');
        this.printLine('🧙 <span class="game-location">WIZARD\'S TOWER</span>');
        this.printLine('');
        
        if (!this.gameState.flags.metWizard) {
            this.printLine('<span class="game-npc">Wizard: "Welcome, young warrior. I sense great power within you..."</span>');
            this.printLine('<span class="game-npc">Wizard: "The Ancient Dragon King is ancient evil incarnate."</span>');
            this.printLine('<span class="game-npc">Wizard: "You must grow stronger before you face it."</span>');
            this.gameState.flags.metWizard = true;
        } else if (this.gameState.player.level >= 5 && this.gameState.player.dragonKills >= 3) {
            this.printLine('<span class="game-npc">Wizard: "You are ready! Take this blessing..."</span>');
            this.gameState.player.maxHealth += 50;
            this.gameState.player.health = this.gameState.player.maxHealth;
            this.printLine('<span class="game-reward">✨ Max Health increased by 50!</span>');
        } else {
            this.printLine('<span class="game-npc">Wizard: "Your power grows. Soon, you will be ready..."</span>');
        }
        
        this.printLine('');
        setTimeout(() => this.gameShowVillage(), 2000);
    }
    
    gameInventory() {
        this.printLine('');
        this.printLine('🎒 <span class="game-location">INVENTORY</span>');
        this.printLine('');
        this.printLine(`<span class="game-equipped">Equipped Weapon: ${this.gameState.player.equipped.weapon}</span>`);
        this.printLine(`<span class="game-equipped">Equipped Armor: ${this.gameState.player.equipped.armor}</span>`);
        this.printLine('');
        this.printLine('<span class="game-items">Items:</span>');
        
        if (this.gameState.player.inventory.length === 0) {
            this.printLine('  <span class="game-empty">Your inventory is empty.</span>');
        } else {
            this.gameState.player.inventory.forEach(item => {
                this.printLine(`  • ${item}`);
            });
        }
        
        this.printLine('');
        setTimeout(() => this.gameShowVillage(), 2000);
    }
    
    gameShowStats() {
        this.gameCalculateStats();
        this.printLine('');
        this.printLine('╔═══════════════ CHARACTER STATUS ═══════════════╗', 'game-stats');
        this.printLine(`║ Name: ${this.gameState.player.name.padEnd(40)}║`, 'game-stats');
        this.printLine(`║ Level: ${this.gameState.player.level.toString().padEnd(39)}║`, 'game-stats');
        this.printLine(`║ Health: ${this.gameState.player.health}/${this.gameState.player.maxHealth}`.padEnd(49) + '║', 'game-stats');
        this.printLine(`║ Stamina: ${this.gameState.player.stamina}/${this.gameState.player.maxStamina}`.padEnd(49) + '║', 'game-stats');
        this.printLine(`║ Gold: ${this.gameState.player.gold}`.padEnd(49) + '║', 'game-stats');
        this.printLine(`║ Experience: ${this.gameState.player.experience}`.padEnd(49) + '║', 'game-stats');
        this.printLine(`║ Attack: ${this.gameState.player.attack} | Defense: ${this.gameState.player.defense}`.padEnd(49) + '║', 'game-stats');
        this.printLine(`║ Dragons Slain: ${this.gameState.player.dragonKills}`.padEnd(49) + '║', 'game-stats');
        this.printLine('╚════════════════════════════════════════════════╝', 'game-stats');
        this.printLine('');
        
        setTimeout(() => this.gameShowVillage(), 2000);
    }
    
    gameCalculateStats() {
        const weapon = this.gameItems[this.gameState.player.equipped.weapon];
        const armor = this.gameItems[this.gameState.player.equipped.armor];
        
        this.gameState.player.attack = 10 + this.gameState.player.level * 2 + (weapon ? weapon.attack : 0);
        this.gameState.player.defense = 5 + this.gameState.player.level + (armor ? armor.defense : 0);
        this.gameState.player.maxHealth = 100 + this.gameState.player.level * 10;
        this.gameState.player.maxStamina = 100 + this.gameState.player.level * 5;
    }
    
    gameWorldMap() {
        this.gameState.location = 'worldmap';
        this.printLine('');
        this.printLine('╔═══════════════════════════════════════════════════════╗', 'game-location');
        this.printLine('║         🗺️  WORLD MAP                                 ║', 'game-location');
        this.printLine('╚═══════════════════════════════════════════════════════╝', 'game-location');
        this.printLine('');
        
        const options = [
            '1. 🏘️  Return to village',
            '2. 🌲 Dark Forest (Easy)',
            '3. ⛰️  Mountain Pass (Medium)',
            '4. 🕳️  Ancient Cave (Hard)'
        ];
        
        if (this.gameState.player.level >= 3) {
            options.push('5. 🏔️  Dragon\'s Lair (Very Hard)');
        }
        
        if (this.gameState.player.level >= 5 && this.gameState.player.dragonKills >= 2) {
            options.push('6. 🌋 Volcanic Peak (FINAL BATTLE!)');
        }
        
        options.push('0. Go back');
        this.gameShowOptions(options);
    }
    
    gameHandleWorldMapChoice(choice) {
        switch(choice) {
            case '1': this.gameShowVillage(); break;
            case '2': this.gameEncounter('Forest Wolf', '🌲 Dark Forest'); break;
            case '3': this.gameEncounter('Mountain Bandit', '⛰️  Mountain Pass'); break;
            case '4': this.gameEncounter('Cave Troll', '🕳️  Ancient Cave'); break;
            case '5':
                if (this.gameState.player.level >= 3) {
                    this.gameEncounter('Lesser Dragon', '🏔️  Dragon\'s Lair');
                }
                break;
            case '6':
                if (this.gameState.player.level >= 5 && this.gameState.player.dragonKills >= 2) {
                    this.gameFinalBattle();
                }
                break;
            case '0': this.gameShowVillage(); break;
            default:
                this.printLine('<span class="output-error">Invalid choice.</span>');
                this.gameWorldMap();
        }
    }
    
    gameEncounter(enemyName, locationName) {
        this.printLine('');
        this.printLine(`<span class="game-location">${locationName}</span>`);
        this.printLine('');
        
        if (Math.random() < 0.7) {
            this.printLine(`<span class="game-combat">⚠️  A ${enemyName} appears!</span>`);
            this.printLine('');
            setTimeout(() => this.gameStartCombat(enemyName), 1000);
        } else {
            this.printLine('<span class="game-success">You find a peaceful spot and rest. Health restored!</span>');
            this.gameState.player.health = Math.min(this.gameState.player.maxHealth, this.gameState.player.health + 30);
            this.printLine('');
            setTimeout(() => this.gameWorldMap(), 1500);
        }
    }
    
    gameStartCombat(enemyName) {
        this.gameState.location = 'combat';
        this.gameCurrentEnemy = { ...this.gameEnemies[enemyName], name: enemyName };
        this.gameCurrentEnemy.maxHealth = this.gameCurrentEnemy.health;
        
        this.gameCalculateStats();
        this.gameShowCombat();
    }
    
    gameShowCombat() {
        const enemy = this.gameCurrentEnemy;
        
        this.printLine('');
        this.printLine('══════════════════ COMBAT ══════════════════', 'game-combat');
        this.printLine(`<span class="game-enemy">${enemy.name}: ❤️  ${enemy.health}/${enemy.maxHealth}</span>`);
        this.printLine(`<span class="game-player">${this.gameState.player.name}: ❤️  ${this.gameState.player.health}/${this.gameState.player.maxHealth} | ⚡ ${this.gameState.player.stamina}/${this.gameState.player.maxStamina}</span>`);
        this.printLine('═══════════════════════════════════════════', 'game-combat');
        this.printLine('');
        
        this.gameShowOptions([
            '1. ⚔️  Attack',
            '2. 🛡️  Defend (restore stamina)',
            '3. ⚡ Power Strike (30 stamina)',
            '4. 🍾 Use Potion',
            '5. 🏃 Flee'
        ]);
    }
    
    gameHandleCombatChoice(choice) {
        const enemy = this.gameCurrentEnemy;
        let playerAction = true;
        
        if (choice === '1') {
            // Attack
            const damage = Math.max(1, this.gameState.player.attack - enemy.defense + Math.floor(Math.random() * 5));
            enemy.health -= damage;
            this.printLine(`<span class="game-combat-action">⚔️  You strike for ${damage} damage!</span>`);
        } else if (choice === '2') {
            // Defend
            this.gameState.player.stamina = Math.min(this.gameState.player.maxStamina, this.gameState.player.stamina + 20);
            this.printLine('<span class="game-combat-action">🛡️  You brace yourself and recover stamina...</span>');
        } else if (choice === '3') {
            // Power Strike
            if (this.gameState.player.stamina >= 30) {
                const damage = Math.max(1, Math.floor(this.gameState.player.attack * 1.8) - enemy.defense);
                enemy.health -= damage;
                this.gameState.player.stamina -= 30;
                this.printLine(`<span class="game-combat-special">⚡💥 POWER STRIKE! You deal ${damage} damage!</span>`);
            } else {
                this.printLine('<span class="output-error">❌ Not enough stamina!</span>');
                playerAction = false;
            }
        } else if (choice === '4') {
            // Use Potion
            const potions = this.gameState.player.inventory.filter(item => 
                item.includes('Potion') || item.includes('Elixir')
            );
            
            if (potions.length > 0) {
                const potion = potions[0];
                const itemData = this.gameItems[potion];
                
                if (itemData.healAmount) {
                    this.gameState.player.health = Math.min(
                        this.gameState.player.maxHealth,
                        this.gameState.player.health + itemData.healAmount
                    );
                    this.printLine(`<span class="game-combat-action">🍾 Used ${potion}! Restored ${itemData.healAmount} health.</span>`);
                }
                
                this.gameState.player.inventory.splice(
                    this.gameState.player.inventory.indexOf(potion), 1
                );
            } else {
                this.printLine('<span class="output-error">❌ No potions available!</span>');
                playerAction = false;
            }
        } else if (choice === '5') {
            // Flee
            if (Math.random() < 0.5) {
                this.printLine('<span class="game-success">🏃 You successfully fled from battle!</span>');
                this.printLine('');
                setTimeout(() => this.gameWorldMap(), 1000);
                return;
            } else {
                this.printLine('<span class="output-error">❌ Failed to escape!</span>');
            }
        } else {
            this.printLine('<span class="output-error">Invalid choice.</span>');
            playerAction = false;
        }
        
        // Check if enemy is defeated
        if (enemy.health <= 0) {
            this.gameVictory();
            return;
        }
        
        // Enemy turn
        if (playerAction) {
            const enemyDamage = Math.max(1, enemy.attack - this.gameState.player.defense + Math.floor(Math.random() * 3));
            this.gameState.player.health -= enemyDamage;
            this.printLine(`<span class="game-combat-enemy">💢 ${enemy.name} attacks! You take ${enemyDamage} damage!</span>`);
            
            // Check if player is defeated
            if (this.gameState.player.health <= 0) {
                this.gameDefeat();
                return;
            }
        }
        
        // Continue combat
        setTimeout(() => this.gameShowCombat(), 800);
    }
    
    gameVictory() {
        const enemy = this.gameCurrentEnemy;
        this.printLine('');
        this.printLine(`<span class="game-victory">🎉 Victory! ${enemy.name} has been defeated!</span>`);
        this.gameState.player.gold += this.gameEnemies[enemy.name].gold;
        this.printLine(`<span class="game-gold">💰 Found ${this.gameEnemies[enemy.name].gold} gold!</span>`);
        
        // Gain experience
        this.gameGainExperience(this.gameEnemies[enemy.name].exp);
        
        if (enemy.name.includes('Dragon')) {
            this.gameState.player.dragonKills++;
            this.printLine(`<span class="game-dragon">🐉 Dragon kill count: ${this.gameState.player.dragonKills}</span>`);
        }
        
        this.printLine('');
        setTimeout(() => this.gameWorldMap(), 2500);
    }
    
    gameGainExperience(amount) {
        this.gameState.player.experience += amount;
        this.printLine(`<span class="game-exp">✨ Gained ${amount} experience!</span>`);
        
        const expNeeded = this.gameState.player.level * 100;
        if (this.gameState.player.experience >= expNeeded) {
            this.gameState.player.level++;
            this.gameState.player.experience -= expNeeded;
            this.printLine(`<span class="game-levelup">🎉 LEVEL UP! You are now level ${this.gameState.player.level}!</span>`);
            this.gameCalculateStats();
            this.gameState.player.health = this.gameState.player.maxHealth;
            this.gameState.player.stamina = this.gameState.player.maxStamina;
        }
    }
    
    gameDefeat() {
        this.printLine('');
        this.printLine('<span class="game-defeat">💀 You have been defeated...</span>');
        this.printLine('<span class="game-story">But your story is not over.</span>');
        this.printLine('');
        
        // Restore player
        this.gameState.player.health = this.gameState.player.maxHealth;
        this.gameState.player.stamina = this.gameState.player.maxStamina;
        
        setTimeout(() => this.gameShowVillage(), 2000);
    }
    
    gameFinalBattle() {
        this.printLine('');
        this.printLine('╔═══════════════════════════════════════════════════════╗', 'game-final');
        this.printLine('║         🌋 VOLCANIC PEAK                              ║', 'game-final');
        this.printLine('╚═══════════════════════════════════════════════════════╝', 'game-final');
        this.printLine('');
        this.printLine('<span class="game-story">You stand at the peak of the volcano...</span>');
        this.printLine('<span class="game-story">Lava flows around you. The heat is unbearable.</span>');
        this.printLine('<span class="game-story">Then, you see it...</span>');
        this.printLine('');
        this.printLine('<span class="game-dragon">🐉🐉🐉 THE ANCIENT DRAGON KING APPEARS! 🐉🐉🐉</span>');
        this.printLine('');
        this.printLine('<span class="game-dragon-speak">"MORTAL... YOU DARE CHALLENGE ME?"</span>');
        this.printLine('');
        
        this.gameFinalBattleEnemy = true;
        setTimeout(() => this.gameStartCombat('Ancient Dragon King'), 2000);
    }
    
    gameExit() {
        this.gameState.inGame = false;
        this.commandInput.disabled = false;
        this.printLine('');
        this.printLine('<span class="game-story">Thank you for playing The Dragon Slayer!</span>');
        this.printLine('');
        this.printLine('═'.repeat(50), 'welcome-message');
        this.printLine('Type <strong>dragon-slayer</strong> to play again!', 'welcome-message');
        this.printLine('═'.repeat(50), 'welcome-message');
        this.printLine('');
    }
    
    // Theme System
    showThemeSelector() {
        this.themes = [
            {
                name: 'Default Dark',
                colors: {
                    background: '#1e1e1e',
                    headerBg: '#323232',
                    text: '#f0f0f0',
                    prompt: '#4ec9b0',
                    command: '#6c757d',
                    error: '#ff6b6b',
                    directory: '#569cd6',
                    file: '#9cdcfe'
                }
            },
            {
                name: 'Dracula',
                colors: {
                    background: '#282a36',
                    headerBg: '#44475a',
                    text: '#f8f8f2',
                    prompt: '#50fa7b',
                    command: '#6272a4',
                    error: '#ff5555',
                    directory: '#bd93f9',
                    file: '#8be9fd'
                }
            },
            {
                name: 'Monokai',
                colors: {
                    background: '#272822',
                    headerBg: '#3e3d32',
                    text: '#f8f8f2',
                    prompt: '#a6e22e',
                    command: '#75715e',
                    error: '#f92672',
                    directory: '#66d9ef',
                    file: '#e6db74'
                }
            },
            {
                name: 'Nord',
                colors: {
                    background: '#2e3440',
                    headerBg: '#3b4252',
                    text: '#eceff4',
                    prompt: '#88c0d0',
                    command: '#4c566a',
                    error: '#bf616a',
                    directory: '#81a1c1',
                    file: '#8fbcbb'
                }
            },
            {
                name: 'Solarized Dark',
                colors: {
                    background: '#002b36',
                    headerBg: '#073642',
                    text: '#839496',
                    prompt: '#2aa198',
                    command: '#586e75',
                    error: '#dc322f',
                    directory: '#268bd2',
                    file: '#b58900'
                }
            },
            {
                name: 'One Dark',
                colors: {
                    background: '#282c34',
                    headerBg: '#21252b',
                    text: '#abb2bf',
                    prompt: '#98c379',
                    command: '#5c6370',
                    error: '#e06c75',
                    directory: '#61afef',
                    file: '#e5c07b'
                }
            },
            {
                name: 'Gruvbox Dark',
                colors: {
                    background: '#282828',
                    headerBg: '#3c3836',
                    text: '#ebdbb2',
                    prompt: '#b8bb26',
                    command: '#928374',
                    error: '#fb4934',
                    directory: '#83a598',
                    file: '#fabd2f'
                }
            },
            {
                name: 'Tokyo Night',
                colors: {
                    background: '#1a1b26',
                    headerBg: '#24283b',
                    text: '#a9b1d6',
                    prompt: '#9ece6a',
                    command: '#565f89',
                    error: '#f7768e',
                    directory: '#7aa2f7',
                    file: '#bb9af7'
                }
            },
            {
                name: 'Cyberpunk',
                colors: {
                    background: '#000b1e',
                    headerBg: '#0a1929',
                    text: '#00ff9f',
                    prompt: '#ff006e',
                    command: '#00b4d8',
                    error: '#ff0054',
                    directory: '#00ffff',
                    file: '#ffbe0b'
                }
            },
            {
                name: 'Light Mode',
                colors: {
                    background: '#ffffff',
                    headerBg: '#f5f5f5',
                    text: '#333333',
                    prompt: '#0066cc',
                    command: '#999999',
                    error: '#cc0000',
                    directory: '#0066cc',
                    file: '#006600'
                }
            },
            {
                name: 'Matrix',
                colors: {
                    background: '#000000',
                    headerBg: '#0d0d0d',
                    text: '#00ff00',
                    prompt: '#00ff00',
                    command: '#008000',
                    error: '#ff0000',
                    directory: '#00ff00',
                    file: '#00cc00'
                }
            },
            {
                name: 'Oceanic',
                colors: {
                    background: '#1b2b34',
                    headerBg: '#343d46',
                    text: '#cdd3de',
                    prompt: '#5fb3b3',
                    command: '#65737e',
                    error: '#ec5f67',
                    directory: '#6699cc',
                    file: '#99c794'
                }
            }
        ];
        
        this.currentThemeIndex = 0;
        this.themeSelectionMode = true;
        
        this.printLine('');
        this.printLine('╔════════════════════════════════════════════════════╗', 'theme-header');
        this.printLine('║           THEME SELECTOR                           ║', 'theme-header');
        this.printLine('╚════════════════════════════════════════════════════╝', 'theme-header');
        this.printLine('');
        this.printLine('<span class="theme-instruction">Use ↑/↓ Arrow Keys to navigate, Enter to apply, Esc to cancel</span>');
        this.printLine('');
        
        this.renderThemeList();
        
        // Disable normal input
        this.commandInput.disabled = true;
        
        // Theme selection key handler - attach to document
        this.themeKeyHandler = (e) => {
            if (!this.themeSelectionMode || !this.themeKeyHandlerReady) {
                return;
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.currentThemeIndex = (this.currentThemeIndex - 1 + this.themes.length) % this.themes.length;
                this.updateThemeList();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
                this.updateThemeList();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.applyTheme(this.themes[this.currentThemeIndex]);
                this.exitThemeSelector();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.printLine('');
                this.printLine('<span class="theme-cancelled">Theme selection cancelled.</span>');
                this.printLine('');
                this.exitThemeSelector();
            }
        };
        
        // Add event listener to document for theme navigation
        document.addEventListener('keydown', this.themeKeyHandler);
        
        // Enable handler after a small delay to prevent immediate Enter trigger
        this.themeKeyHandlerReady = false;
        setTimeout(() => {
            this.themeKeyHandlerReady = true;
        }, 100);
    }
    
    renderThemeList() {
        if (!this.themes || this.themes.length === 0) {
            console.error('No themes available');
            return;
        }
        
        this.themeListElement = document.createElement('div');
        this.themeListElement.className = 'theme-list';
        this.themeListElement.id = 'theme-list';
        
        this.themes.forEach((theme, index) => {
            const themeItem = document.createElement('div');
            themeItem.className = 'theme-item';
            themeItem.id = `theme-item-${index}`;
            
            const selected = index === this.currentThemeIndex;
            const arrow = selected ? '► ' : '  ';
            
            themeItem.innerHTML = `
                <span class="theme-arrow">${arrow}</span>
                <span class="theme-name" style="color: ${theme.colors.prompt}">${theme.name}</span>
                <span class="theme-preview" style="background: ${theme.colors.background}; border: 2px solid ${theme.colors.prompt};"></span>
            `;
            
            if (selected) {
                themeItem.classList.add('theme-selected');
            }
            
            this.themeListElement.appendChild(themeItem);
        });
        
        this.output.appendChild(this.themeListElement);
        this.scrollToBottom();
    }
    
    updateThemeList() {
        this.themes.forEach((theme, index) => {
            const themeItem = document.getElementById(`theme-item-${index}`);
            const selected = index === this.currentThemeIndex;
            const arrow = selected ? '► ' : '  ';
            
            themeItem.innerHTML = `
                <span class="theme-arrow">${arrow}</span>
                <span class="theme-name" style="color: ${theme.colors.prompt}">${theme.name}</span>
                <span class="theme-preview" style="background: ${theme.colors.background}; border: 2px solid ${theme.colors.prompt};"></span>
            `;
            
            if (selected) {
                themeItem.classList.add('theme-selected');
            } else {
                themeItem.classList.remove('theme-selected');
            }
        });
        
        // Scroll selected item into view
        const selectedItem = document.getElementById(`theme-item-${this.currentThemeIndex}`);
        if (selectedItem) {
            selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    applyTheme(theme, silent = false) {
        if (!theme || !theme.colors) {
            console.error('Invalid theme object');
            return;
        }
        
        // Apply colors to terminal
        document.body.style.background = theme.colors.background;
        
        const terminal = document.querySelector('.terminal');
        if (terminal) terminal.style.background = theme.colors.background;
        
        const terminalBody = document.querySelector('.terminal-body');
        if (terminalBody) terminalBody.style.background = theme.colors.background;
        
        const terminalHeader = document.querySelector('.terminal-header');
        if (terminalHeader) terminalHeader.style.background = theme.colors.headerBg;
        
        // Update CSS variables
        const root = document.documentElement;
        root.style.setProperty('--text-color', theme.colors.text);
        root.style.setProperty('--prompt-color', theme.colors.prompt);
        root.style.setProperty('--command-color', theme.colors.command);
        root.style.setProperty('--error-color', theme.colors.error);
        root.style.setProperty('--directory-color', theme.colors.directory);
        root.style.setProperty('--file-color', theme.colors.file);
        
        // Apply text colors
        if (this.output) this.output.style.color = theme.colors.text;
        if (this.prompt) this.prompt.style.color = theme.colors.prompt;
        if (this.commandInput) {
            this.commandInput.style.color = theme.colors.text;
            this.commandInput.style.caretColor = theme.colors.text;
        }
        
        // Store theme preference (only if not silent)
        if (!silent) {
            localStorage.setItem('cli-theme', JSON.stringify(theme));
            this.printLine('');
            this.printLine(`<span class="theme-applied">✓ Theme "${theme.name}" applied successfully!</span>`);
            this.printLine('');
        } else {
            // Still save but don't show message
            localStorage.setItem('cli-theme', JSON.stringify(theme));
        }
    }
    
    exitThemeSelector() {
        this.themeSelectionMode = false;
        this.commandInput.disabled = false;
        this.commandInput.focus();
        
        // Remove event listener
        if (this.themeKeyHandler) {
            document.removeEventListener('keydown', this.themeKeyHandler);
            this.themeKeyHandler = null;
        }
        
        // Remove theme list
        if (this.themeListElement) {
            this.themeListElement.remove();
        }
    }
    
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('cli-theme');
            if (savedTheme) {
                const theme = JSON.parse(savedTheme);
                // Apply theme silently on init
                if (theme && theme.colors) {
                    this.applyTheme(theme, true);
                }
            }
        } catch (e) {
            console.error('Failed to load saved theme:', e);
            // Continue with default theme
        }
    }
}

// Initialize the CLI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WebCLI();
});
