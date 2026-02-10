export class ThemeManager {
    constructor(cli) {
        this.cli = cli;
        this.currentThemeIndex = 0;
        this.themeSelectionMode = false;

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
    }

    showSelector() {
        this.themeSelectionMode = true;

        this.cli.printLine('');
        this.cli.printLine('╔════════════════════════════════════════════════════╗', 'theme-header');
        this.cli.printLine('║           THEME SELECTOR                           ║', 'theme-header');
        this.cli.printLine('╚════════════════════════════════════════════════════╝', 'theme-header');
        this.cli.printLine('');
        this.cli.printLine('<span class="theme-instruction">Use UP/DOWN Arrow Keys to navigate, Enter to apply, Esc to cancel</span>');
        this.cli.printLine('');

        this.renderThemeList();

        // Disable normal input
        this.cli.commandInput.disabled = true;

        // Theme selection key handler
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
                this.exitSelector();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.cli.printLine('');
                this.cli.printLine('<span class="theme-cancelled">Theme selection cancelled.</span>');
                this.cli.printLine('');
                this.exitSelector();
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
            const arrow = selected ? '> ' : '  ';

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

        this.cli.output.appendChild(this.themeListElement);
        this.cli.scrollToBottom();
    }

    updateThemeList() {
        this.themes.forEach((theme, index) => {
            const themeItem = document.getElementById(`theme-item-${index}`);
            const selected = index === this.currentThemeIndex;
            const arrow = selected ? '> ' : '  ';

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
        if (this.cli.output) this.cli.output.style.color = theme.colors.text;
        if (this.cli.prompt) this.cli.prompt.style.color = theme.colors.prompt;
        if (this.cli.commandInput) {
            this.cli.commandInput.style.color = theme.colors.text;
            this.cli.commandInput.style.caretColor = theme.colors.text;
        }

        // Store theme preference (only if not silent)
        if (!silent) {
            localStorage.setItem('cli-theme', JSON.stringify(theme));
            this.cli.printLine('');
            this.cli.printLine(`<span class="theme-applied">Theme "${theme.name}" applied successfully!</span>`);
            this.cli.printLine('');
        } else {
            // Still save but don't show message
            localStorage.setItem('cli-theme', JSON.stringify(theme));
        }
    }

    exitSelector() {
        this.themeSelectionMode = false;
        this.cli.commandInput.disabled = false;
        this.cli.commandInput.focus();

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
