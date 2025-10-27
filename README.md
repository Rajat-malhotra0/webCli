# Web CLI - Terminal in Your Browser

A fully functional command-line interface that runs in your web browser with an epic RPG game and customizable themes!

## Quick Start

1. Open `index.html` in your browser
2. Start typing commands!

## Features

### File System Operations
- `ls`, `cd`, `pwd`, `mkdir`, `touch`
- `cat`, `rm`, `cp`, `mv`
- `grep`, `wc`, `head`, `tail`, `find`

### Built-in RPG Game
Type `dragon-slayer` to start an epic text-based adventure!
- Turn-based combat system
- Character progression & leveling
- Equipment and inventory management
- Multiple locations to explore
- Boss battles including the Ancient Dragon King!

See [README_DRAGON_SLAYER.md](README_DRAGON_SLAYER.md) for full game guide.

### Theme Customization
Type `theme` to choose from 12 beautiful themes!
- Use arrow keys (↑/↓) to navigate
- Press Enter to apply
- Press Esc to cancel
- Themes are auto-saved

**Available Themes:**
1. Default Dark - Classic terminal
2. Dracula - Popular purple theme
3. Monokai - Warm developer favorite
4. Nord - Cool arctic colors
5. Solarized Dark - Eye-strain optimized
6. One Dark - Atom-inspired
7. Gruvbox Dark - Retro earthy tones
8. Tokyo Night - Deep blues
9. Cyberpunk - Neon futuristic
10. Light Mode - For bright rooms
11. Matrix - Classic green-on-black
12. Oceanic - Ocean-inspired blues

See [THEME_GUIDE.md](THEME_GUIDE.md) for detailed theme info.

## Available Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `clear` | Clear the terminal screen |
| `ls` | List directory contents |
| `pwd` | Print working directory |
| `cd [dir]` | Change directory |
| `mkdir [name]` | Create directory |
| `touch [file]` | Create file |
| `cat [file]` | Display file contents |
| `echo [text]` | Print text |
| `rm [file]` | Remove file |
| `cp [src] [dest]` | Copy files |
| `mv [src] [dest]` | Move/rename files |
| `grep [pattern] [file]` | Search in files |
| `wc [file]` | Count lines/words |
| `head [file]` | Show first lines |
| `tail [file]` | Show last lines |
| `find [name]` | Find files |
| `date` | Show current date/time |
| `whoami` | Show current user |
| `history` | Show command history |
| `tree` | Display directory tree |
| `uname` | System information |
| `dragon-slayer` | Start RPG game |
| `theme` | Change theme |

## Keyboard Shortcuts

- **↑/↓** - Navigate command history
- **Tab** - Auto-complete commands
- **Ctrl+C** - Cancel current operation
- **Enter** - Execute command

## Special Features

### Command History
- Use arrow keys to navigate through previous commands
- Full history available with `history` command

### Tab Completion
- Press Tab to auto-complete commands
- Works with all built-in commands

### File System
- Virtual file system with directories and files
- Persistent during session
- Sample files and directories included

### Theme System
- 12 professionally designed themes
- Arrow key navigation
- Auto-save preferences
- Instant preview

## Dragon Slayer Game Features

- **Rich Story**: Epic narrative in Kingdom of Aethermoor
- **Combat System**: Turn-based with multiple attack options
- **Character Progression**: Leveling, stats, equipment
- **Multiple Locations**: Village, Forest, Mountains, Caves, Dragon Lairs
- **NPCs**: Blacksmith, Wizard, Villagers with quests
- **Shop System**: Buy weapons, armor, and potions
- **Final Boss**: Ancient Dragon King battle

## Theme Customization

Each theme includes custom colors for:
- Background
- Header
- Text
- Prompts
- Commands
- Errors
- Directories
- Files

Themes persist across browser sessions using localStorage.

## Technical Stack

- **Pure HTML/CSS/JavaScript** - No frameworks or dependencies
- **localStorage** - Theme and preference persistence
- **Responsive Design** - Works on all screen sizes
- **Keyboard-Driven** - Full keyboard navigation support

## Tips & Tricks

1. **Theme for Time of Day**: Use light themes during day, dark at night
2. **Game Progress**: Dragon Slayer progress is maintained during session
3. **Command History**: Use ↑/↓ to quickly repeat commands
4. **Tab Completion**: Save time by using Tab for command completion
5. **Explore Files**: Use `ls`, `cd`, and `cat` to explore the file system

## Getting Started

### For General Use:
```bash
help           # See all commands
ls             # List files
cd documents   # Navigate directories
cat readme.txt # Read files
```

### For Gaming:
```bash
dragon-slayer  # Start the RPG adventure
# Follow on-screen prompts
# Use numbers 0-7 to make choices
```

### For Customization:
```bash
theme          # Open theme selector
# Use ↑/↓ to browse
# Press Enter to apply
```

## Documentation

- [Dragon Slayer Game Guide](README_DRAGON_SLAYER.md) - Full RPG documentation
- [Theme Guide](THEME_GUIDE.md) - All about themes and customization


## Known Features

- Command history persists during session
- Theme preferences saved permanently
- File system resets on page reload (by design)
- Game progress resets on page reload (adds replayability!)

---
