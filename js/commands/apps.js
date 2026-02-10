export const appCommands = {
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
            this.printLine(`Weather in ${args.join(' ')}: [SUNNY], 25C`, 'game-success');
            this.scrollToBottom();
        }
    }
};
