export const fileCommands = {
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
