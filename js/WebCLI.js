import { initialFileSystem } from './data/fileSystemData.js';
import { ThemeManager } from './ui/ThemeManager.js';
import { DragonSlayer } from './game/DragonSlayer.js';
import { coreCommands } from './commands/core.js';
import { fileCommands } from './commands/files.js';
import { appCommands } from './commands/apps.js';

export class WebCLI {
    constructor() {
        this.commandInput = document.getElementById('command-input');
        this.output = document.getElementById('output');
        this.terminalBody = document.getElementById('terminal-body');
        this.prompt = document.getElementById('prompt');
        this.terminal = document.getElementById('terminal');
        this.terminalHeader = document.getElementById('terminal-header');
        this.statusTime = document.getElementById('status-time');

        this.currentPath = '/home/user';
        this.fileSystem = JSON.parse(JSON.stringify(initialFileSystem)); // Deep copy

        this.commandHistory = [];
        this.historyIndex = -1;

        // Initialize Modules
        this.themeManager = new ThemeManager(this);
        this.game = new DragonSlayer(this);

        // Combine commands
        this.commands = {
            ...coreCommands,
            ...fileCommands,
            ...appCommands,
            'dragon-slayer': () => this.game.start(),
            theme: () => this.themeManager.showSelector()
        };

        // Bind commands to this instance
        Object.keys(this.commands).forEach(key => {
            if (typeof this.commands[key] === 'function') {
                this.commands[key] = this.commands[key].bind(this);
            }
        });

        this.init();
    }

    init() {
        this.themeManager.loadSavedTheme();
        this.printWelcome();
        this.commandInput.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Focus input on click, but not if selecting text
        this.terminalBody.addEventListener('click', () => {
             if (window.getSelection().toString().length === 0) {
                 this.commandInput.focus();
             }
        });

        // Close button functionality (if it exists)
        const closeBtn = document.querySelector('.btn.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.clearOutput();
                this.printLine('Terminal closed. Refresh page to restart.', 'output-error');
                this.commandInput.disabled = true;
            });
        }

        // Minimize/Maximize buttons logic removed for full screen mode

        this.startClock();
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            if (this.statusTime) {
                this.statusTime.textContent = now.toLocaleTimeString();
            }
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    printWelcome() {
        this.printLine('===========================================================', 'welcome-message');
        this.printLine('|         Welcome to Web-based CLI Terminal v1.0          |', 'welcome-message');
        this.printLine('|                                                         |', 'welcome-message');
        this.printLine('|  Type "help" to see available commands                  |', 'welcome-message');
        this.printLine('===========================================================', 'welcome-message');
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
            this.commands[command](args);
        } else {
            this.printLine(`bash: ${command}: command not found`, 'output-error');
        }

        this.scrollToBottom();
    }

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
}
