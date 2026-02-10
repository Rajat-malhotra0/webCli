export const coreCommands = {
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

    uname: function(args) {
        if (args.includes('-a')) {
            this.printLine('WebCLI 1.0.0 web-terminal x86_64 Browser/OS');
        } else {
            this.printLine('WebCLI');
        }
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
    }
};
