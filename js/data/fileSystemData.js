export const initialFileSystem = {
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
