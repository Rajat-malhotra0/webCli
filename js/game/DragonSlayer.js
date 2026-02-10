export class DragonSlayer {
    constructor(cli) {
        this.cli = cli;
        this.gameState = null;
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
    }

    start() {
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

        this.cli.commandInput.disabled = true;
        this.intro();
    }

    intro() {
        this.cli.printLine('');
        this.cli.printLine('=======================================================', 'game-banner');
        this.cli.printLine('|             [DRAGON SLAYER] [SWORD]                 |', 'game-banner');
        this.cli.printLine('=======================================================', 'game-banner');
        this.cli.printLine('');
        this.cli.printLine('<span class="game-story">In the Kingdom of Aethermoor, darkness spreads across the land...</span>');
        this.cli.printLine('<span class="game-story">Dragons, once sleeping in ancient mountains, have awakened.</span>');
        this.cli.printLine('<span class="game-story">Villages burn. People flee. Hope fades.</span>');
        this.cli.printLine('');
        this.cli.printLine('<span class="game-story">But legends speak of a hero...</span>');
        this.cli.printLine('');

        setTimeout(() => {
            this.askName();
        }, 2000);
    }

    askName() {
        this.cli.printLine('<span class="game-question">What is your name, brave warrior?</span>');
        this.cli.printLine('<span class="game-hint">[Type your name and press Enter]</span>');

        this.cli.commandInput.disabled = false;
        this.cli.commandInput.focus();
        this.waitingForName = true;

        // Temporarily override key handler
        this.originalKeyPress = this.cli.handleKeyPress.bind(this.cli);
        this.cli.handleKeyPress = (e) => {
            if (e.key === 'Enter' && this.waitingForName) {
                const name = this.cli.commandInput.value.trim() || 'Dragonslayer';
                this.gameState.player.name = name;
                this.cli.printLine(`> ${name}`, 'output-command');
                this.cli.commandInput.value = '';
                this.waitingForName = false;
                this.cli.handleKeyPress = this.originalKeyPress;
                this.startAdventure();
            } else if (!this.waitingForName) {
                this.originalKeyPress(e);
            }
        };
    }

    startAdventure() {
        this.cli.printLine('');
        this.cli.printLine(`<span class="game-story">Welcome, <strong>${this.gameState.player.name}</strong>.</span>`);
        this.cli.printLine('<span class="game-story">Your journey begins in the village of Thornhaven...</span>');
        this.cli.printLine('<span class="game-story">The villagers look to you with desperate hope.</span>');
        this.cli.printLine('');

        setTimeout(() => {
            this.showVillage();
        }, 2000);
    }

    showVillage() {
        this.gameState.location = 'village';
        this.cli.commandInput.disabled = false;

        this.cli.printLine('');
        this.cli.printLine('=======================================================', 'game-location');
        this.cli.printLine('|           [VILLAGE OF THORNHAVEN]                   |', 'game-location');
        this.cli.printLine('=======================================================', 'game-location');
        this.cli.printLine('');
        this.cli.printLine('<span class="game-description">You stand in the village square. Smoke rises from chimneys.</span>');
        this.cli.printLine('<span class="game-description">An undercurrent of fear fills the air...</span>');
        this.cli.printLine('');
        this.showOptions([
            '1. [TALK]  Talk to villagers',
            '2. [SHOP]  Visit the shop',
            '3. [FORGE] Visit the blacksmith',
            '4. [WIZARD] Visit the wizard',
            '5. [BAG]   Check inventory',
            '6. [STATS] View stats',
            '7. [MAP]   Explore the world',
            '0. [EXIT]  Exit game'
        ]);
    }

    showOptions(options) {
        options.forEach(opt => this.cli.printLine(`<span class="game-option">${opt}</span>`));
        this.cli.printLine('');
        this.cli.printLine('<span class="game-hint">[Enter a number to choose]</span>');

        this.gameCurrentOptions = options;
        this.cli.commandInput.focus();
        this.waitingForChoice = true;

        this.originalKeyPress = this.cli.handleKeyPress.bind(this.cli);
        this.cli.handleKeyPress = (e) => {
            if (e.key === 'Enter' && this.waitingForChoice && this.gameState.inGame) {
                const choice = this.cli.commandInput.value.trim();
                this.cli.printLine(`> ${choice}`, 'output-command');
                this.cli.commandInput.value = '';
                this.waitingForChoice = false;
                this.cli.handleKeyPress = this.originalKeyPress;
                this.handleChoice(choice);
            } else if (!this.waitingForChoice && !this.gameState.inGame) {
                this.originalKeyPress(e);
            }
        };
    }

    handleChoice(choice) {
        if (this.gameState.location === 'village') {
            switch(choice) {
                case '1': this.talkToVillagers(); break;
                case '2': this.shop(); break;
                case '3': this.blacksmith(); break;
                case '4': this.wizard(); break;
                case '5': this.inventory(); break;
                case '6': this.showStats(); break;
                case '7': this.worldMap(); break;
                case '0': this.exit(); break;
                default:
                    this.cli.printLine('<span class="output-error">Invalid choice. Please try again.</span>');
                    this.showVillage();
            }
        } else if (this.gameState.location === 'worldmap') {
            this.handleWorldMapChoice(choice);
        } else if (this.gameState.location === 'combat') {
            this.handleCombatChoice(choice);
        } else if (this.gameState.location === 'shop') {
            this.handleShopChoice(choice);
        }
    }

    talkToVillagers() {
        const dialogues = [
            'Elder: "A dragon was spotted near the old cave. Please, be careful!"',
            'Farmer: "My crops are withering... I fear the dragon\'s curse."',
            'Child: "Are you really going to slay the dragon? You\'re so brave!"',
            'Merchant: "I heard the Ancient Dragon King dwells in the Volcanic Peak..."'
        ];

        const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
        this.cli.printLine('');
        this.cli.printLine(`<span class="game-npc">${dialogue}</span>`);
        this.cli.printLine('');

        setTimeout(() => this.showVillage(), 1500);
    }

    shop() {
        this.gameState.location = 'shop';
        this.cli.printLine('');
        this.cli.printLine('=======================================================', 'game-location');
        this.cli.printLine('|             [VILLAGE SHOP]                          |', 'game-location');
        this.cli.printLine('=======================================================', 'game-location');
        this.cli.printLine('');
        this.cli.printLine(`<span class="game-gold">Your Gold: ${this.gameState.player.gold} [GOLD]</span>`);
        this.cli.printLine('');

        const shopItems = ['Iron Sword', 'Steel Armor', 'Health Potion', 'Greater Health Potion', 'Stamina Elixir'];
        const options = shopItems.map((item, i) => {
            const itemData = this.gameItems[item];
            return `${i + 1}. ${item} - ${itemData.value} [GOLD]`;
        });
        options.push('0. Leave shop');

        this.showOptions(options);
    }

    handleShopChoice(choice) {
        const shopItems = ['Iron Sword', 'Steel Armor', 'Health Potion', 'Greater Health Potion', 'Stamina Elixir'];
        const itemIndex = parseInt(choice) - 1;

        if (choice === '0') {
            this.showVillage();
        } else if (itemIndex >= 0 && itemIndex < shopItems.length) {
            const item = shopItems[itemIndex];
            const itemData = this.gameItems[item];

            if (this.gameState.player.gold >= itemData.value) {
                this.gameState.player.gold -= itemData.value;
                this.gameState.player.inventory.push(item);
                this.cli.printLine(`<span class="game-success">[OK] Purchased ${item}!</span>`);
                this.cli.printLine('');
                setTimeout(() => this.shop(), 1000);
            } else {
                this.cli.printLine('<span class="output-error">[X] Not enough gold!</span>');
                this.cli.printLine('');
                setTimeout(() => this.shop(), 1000);
            }
        } else {
            this.cli.printLine('<span class="output-error">Invalid choice.</span>');
            this.shop();
        }
    }

    blacksmith() {
        this.cli.printLine('');
        this.cli.printLine('[FORGE] <span class="game-location">BLACKSMITH</span>');
        this.cli.printLine('');

        if (!this.gameState.flags.metBlacksmith) {
            this.cli.printLine('<span class="game-npc">Blacksmith: "Ah, a dragon slayer! I can forge better equipment..."</span>');
            this.cli.printLine('<span class="game-npc">Blacksmith: "But I need rare materials. Bring me dragon scales!"</span>');
            this.gameState.flags.metBlacksmith = true;
        } else if (this.gameState.player.dragonKills >= 2) {
            this.cli.printLine('<span class="game-npc">Blacksmith: "Excellent! Let me craft something special..."</span>');
            if (!this.gameState.player.inventory.includes('Dragon Blade')) {
                this.gameState.player.inventory.push('Dragon Blade');
                this.cli.printLine('<span class="game-reward">[GIFT] Received: Dragon Blade!</span>');
            }
        } else {
            this.cli.printLine('<span class="game-npc">Blacksmith: "Come back when you\'ve proven yourself."</span>');
        }

        this.cli.printLine('');
        setTimeout(() => this.showVillage(), 2000);
    }

    wizard() {
        this.cli.printLine('');
        this.cli.printLine('[WIZARD] <span class="game-location">WIZARD\'S TOWER</span>');
        this.cli.printLine('');

        if (!this.gameState.flags.metWizard) {
            this.cli.printLine('<span class="game-npc">Wizard: "Welcome, young warrior. I sense great power within you..."</span>');
            this.cli.printLine('<span class="game-npc">Wizard: "The Ancient Dragon King is ancient evil incarnate."</span>');
            this.cli.printLine('<span class="game-npc">Wizard: "You must grow stronger before you face it."</span>');
            this.gameState.flags.metWizard = true;
        } else if (this.gameState.player.level >= 5 && this.gameState.player.dragonKills >= 3) {
            this.cli.printLine('<span class="game-npc">Wizard: "You are ready! Take this blessing..."</span>');
            this.gameState.player.maxHealth += 50;
            this.gameState.player.health = this.gameState.player.maxHealth;
            this.cli.printLine('<span class="game-reward">[MAGIC] Max Health increased by 50!</span>');
        } else {
            this.cli.printLine('<span class="game-npc">Wizard: "Your power grows. Soon, you will be ready..."</span>');
        }

        this.cli.printLine('');
        setTimeout(() => this.showVillage(), 2000);
    }

    inventory() {
        this.cli.printLine('');
        this.cli.printLine('[BAG] <span class="game-location">INVENTORY</span>');
        this.cli.printLine('');
        this.cli.printLine(`<span class="game-equipped">Equipped Weapon: ${this.gameState.player.equipped.weapon}</span>`);
        this.cli.printLine(`<span class="game-equipped">Equipped Armor: ${this.gameState.player.equipped.armor}</span>`);
        this.cli.printLine('');
        this.cli.printLine('<span class="game-items">Items:</span>');

        if (this.gameState.player.inventory.length === 0) {
            this.cli.printLine('  <span class="game-empty">Your inventory is empty.</span>');
        } else {
            this.gameState.player.inventory.forEach(item => {
                this.cli.printLine(`  - ${item}`);
            });
        }

        this.cli.printLine('');
        setTimeout(() => this.showVillage(), 2000);
    }

    showStats() {
        this.calculateStats();
        this.cli.printLine('');
        this.cli.printLine('╔═══════════════ CHARACTER STATUS ═══════════════╗', 'game-stats');
        this.cli.printLine(`║ Name: ${this.gameState.player.name.padEnd(40)}║`, 'game-stats');
        this.cli.printLine(`║ Level: ${this.gameState.player.level.toString().padEnd(39)}║`, 'game-stats');
        this.cli.printLine(`║ Health: ${this.gameState.player.health}/${this.gameState.player.maxHealth}`.padEnd(49) + '║', 'game-stats');
        this.cli.printLine(`║ Stamina: ${this.gameState.player.stamina}/${this.gameState.player.maxStamina}`.padEnd(49) + '║', 'game-stats');
        this.cli.printLine(`║ Gold: ${this.gameState.player.gold}`.padEnd(49) + '║', 'game-stats');
        this.cli.printLine(`║ Experience: ${this.gameState.player.experience}`.padEnd(49) + '║', 'game-stats');
        this.cli.printLine(`║ Attack: ${this.gameState.player.attack} | Defense: ${this.gameState.player.defense}`.padEnd(49) + '║', 'game-stats');
        this.cli.printLine(`║ Dragons Slain: ${this.gameState.player.dragonKills}`.padEnd(49) + '║', 'game-stats');
        this.cli.printLine('╚════════════════════════════════════════════════╝', 'game-stats');
        this.cli.printLine('');

        setTimeout(() => this.showVillage(), 2000);
    }

    calculateStats() {
        const weapon = this.gameItems[this.gameState.player.equipped.weapon];
        const armor = this.gameItems[this.gameState.player.equipped.armor];

        this.gameState.player.attack = 10 + this.gameState.player.level * 2 + (weapon ? weapon.attack : 0);
        this.gameState.player.defense = 5 + this.gameState.player.level + (armor ? armor.defense : 0);
        this.gameState.player.maxHealth = 100 + this.gameState.player.level * 10;
        this.gameState.player.maxStamina = 100 + this.gameState.player.level * 5;
    }

    worldMap() {
        this.gameState.location = 'worldmap';
        this.cli.printLine('');
        this.cli.printLine('=======================================================', 'game-location');
        this.cli.printLine('|             [WORLD MAP]                             |', 'game-location');
        this.cli.printLine('=======================================================', 'game-location');
        this.cli.printLine('');

        const options = [
            '1. [VILLAGE] Return to village',
            '2. [FOREST] Dark Forest (Easy)',
            '3. [MOUNTAIN] Mountain Pass (Medium)',
            '4. [CAVE] Ancient Cave (Hard)'
        ];

        if (this.gameState.player.level >= 3) {
            options.push('5. [PEAK] Dragon\'s Lair (Very Hard)');
        }

        if (this.gameState.player.level >= 5 && this.gameState.player.dragonKills >= 2) {
            options.push('6. [VOLCANO] Volcanic Peak (FINAL BATTLE!)');
        }

        options.push('0. Go back');
        this.showOptions(options);
    }

    handleWorldMapChoice(choice) {
        switch(choice) {
            case '1': this.showVillage(); break;
            case '2': this.encounter('Forest Wolf', '[FOREST] Dark Forest'); break;
            case '3': this.encounter('Mountain Bandit', '[MOUNTAIN] Mountain Pass'); break;
            case '4': this.encounter('Cave Troll', '[CAVE] Ancient Cave'); break;
            case '5':
                if (this.gameState.player.level >= 3) {
                    this.encounter('Lesser Dragon', '[PEAK] Dragon\'s Lair');
                }
                break;
            case '6':
                if (this.gameState.player.level >= 5 && this.gameState.player.dragonKills >= 2) {
                    this.finalBattle();
                }
                break;
            case '0': this.showVillage(); break;
            default:
                this.cli.printLine('<span class="output-error">Invalid choice.</span>');
                this.worldMap();
        }
    }

    encounter(enemyName, locationName) {
        this.cli.printLine('');
        this.cli.printLine(`<span class="game-location">${locationName}</span>`);
        this.cli.printLine('');

        if (Math.random() < 0.7) {
            this.cli.printLine(`<span class="game-combat">[!] A ${enemyName} appears!</span>`);
            this.cli.printLine('');
            setTimeout(() => this.startCombat(enemyName), 1000);
        } else {
            this.cli.printLine('<span class="game-success">You find a peaceful spot and rest. Health restored!</span>');
            this.gameState.player.health = Math.min(this.gameState.player.maxHealth, this.gameState.player.health + 30);
            this.cli.printLine('');
            setTimeout(() => this.worldMap(), 1500);
        }
    }

    startCombat(enemyName) {
        this.gameState.location = 'combat';
        this.gameCurrentEnemy = { ...this.gameEnemies[enemyName], name: enemyName };
        this.gameCurrentEnemy.maxHealth = this.gameCurrentEnemy.health;

        this.calculateStats();
        this.showCombat();
    }

    showCombat() {
        const enemy = this.gameCurrentEnemy;

        this.cli.printLine('');
        this.cli.printLine('------------------ COMBAT ------------------', 'game-combat');
        this.cli.printLine(`<span class="game-enemy">${enemy.name}: [HP] ${enemy.health}/${enemy.maxHealth}</span>`);
        this.cli.printLine(`<span class="game-player">${this.gameState.player.name}: [HP] ${this.gameState.player.health}/${this.gameState.player.maxHealth} | [STM] ${this.gameState.player.stamina}/${this.gameState.player.maxStamina}</span>`);
        this.cli.printLine('--------------------------------------------', 'game-combat');
        this.cli.printLine('');

        this.showOptions([
            '1. [ATK] Attack',
            '2. [DEF] Defend (restore stamina)',
            '3. [ATK+] Power Strike (30 stamina)',
            '4. [POTION] Use Potion',
            '5. [RUN] Flee'
        ]);
    }

    handleCombatChoice(choice) {
        const enemy = this.gameCurrentEnemy;
        let playerAction = true;

        if (choice === '1') {
            // Attack
            const damage = Math.max(1, this.gameState.player.attack - enemy.defense + Math.floor(Math.random() * 5));
            enemy.health -= damage;
            this.cli.printLine(`<span class="game-combat-action">[ATK] You strike for ${damage} damage!</span>`);
        } else if (choice === '2') {
            // Defend
            this.gameState.player.stamina = Math.min(this.gameState.player.maxStamina, this.gameState.player.stamina + 20);
            this.cli.printLine('<span class="game-combat-action">[DEF] You brace yourself and recover stamina...</span>');
        } else if (choice === '3') {
            // Power Strike
            if (this.gameState.player.stamina >= 30) {
                const damage = Math.max(1, Math.floor(this.gameState.player.attack * 1.8) - enemy.defense);
                enemy.health -= damage;
                this.gameState.player.stamina -= 30;
                this.cli.printLine(`<span class="game-combat-special">[ATK+] POWER STRIKE! You deal ${damage} damage!</span>`);
            } else {
                this.cli.printLine('<span class="output-error">[X] Not enough stamina!</span>');
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
                    this.cli.printLine(`<span class="game-combat-action">[POTION] Used ${potion}! Restored ${itemData.healAmount} health.</span>`);
                }

                this.gameState.player.inventory.splice(
                    this.gameState.player.inventory.indexOf(potion), 1
                );
            } else {
                this.cli.printLine('<span class="output-error">[X] No potions available!</span>');
                playerAction = false;
            }
        } else if (choice === '5') {
            // Flee
            if (Math.random() < 0.5) {
                this.cli.printLine('<span class="game-success">[RUN] You successfully fled from battle!</span>');
                this.cli.printLine('');
                setTimeout(() => this.worldMap(), 1000);
                return;
            } else {
                this.cli.printLine('<span class="output-error">[X] Failed to escape!</span>');
            }
        } else {
            this.cli.printLine('<span class="output-error">Invalid choice.</span>');
            playerAction = false;
        }

        // Check if enemy is defeated
        if (enemy.health <= 0) {
            this.victory();
            return;
        }

        // Enemy turn
        if (playerAction) {
            const enemyDamage = Math.max(1, enemy.attack - this.gameState.player.defense + Math.floor(Math.random() * 3));
            this.gameState.player.health -= enemyDamage;
            this.cli.printLine(`<span class="game-combat-enemy">[HIT] ${enemy.name} attacks! You take ${enemyDamage} damage!</span>`);

            // Check if player is defeated
            if (this.gameState.player.health <= 0) {
                this.defeat();
                return;
            }
        }

        // Continue combat
        setTimeout(() => this.showCombat(), 800);
    }

    victory() {
        const enemy = this.gameCurrentEnemy;
        this.cli.printLine('');
        this.cli.printLine(`<span class="game-victory">[WIN] Victory! ${enemy.name} has been defeated!</span>`);
        this.gameState.player.gold += this.gameEnemies[enemy.name].gold;
        this.cli.printLine(`<span class="game-gold">[GOLD] Found ${this.gameEnemies[enemy.name].gold} gold!</span>`);

        // Gain experience
        this.gainExperience(this.gameEnemies[enemy.name].exp);

        if (enemy.name.includes('Dragon')) {
            this.gameState.player.dragonKills++;
            this.cli.printLine(`<span class="game-dragon">[DRAGON] Dragon kill count: ${this.gameState.player.dragonKills}</span>`);
        }

        this.cli.printLine('');
        setTimeout(() => this.worldMap(), 2500);
    }

    gainExperience(amount) {
        this.gameState.player.experience += amount;
        this.cli.printLine(`<span class="game-exp">[EXP] Gained ${amount} experience!</span>`);

        const expNeeded = this.gameState.player.level * 100;
        if (this.gameState.player.experience >= expNeeded) {
            this.gameState.player.level++;
            this.gameState.player.experience -= expNeeded;
            this.cli.printLine(`<span class="game-levelup">[LEVEL UP] You are now level ${this.gameState.player.level}!</span>`);
            this.calculateStats();
            this.gameState.player.health = this.gameState.player.maxHealth;
            this.gameState.player.stamina = this.gameState.player.maxStamina;
        }
    }

    defeat() {
        this.cli.printLine('');
        this.cli.printLine('<span class="game-defeat">[DEAD] You have been defeated...</span>');
        this.cli.printLine('<span class="game-story">But your story is not over.</span>');
        this.cli.printLine('');

        // Restore player
        this.gameState.player.health = this.gameState.player.maxHealth;
        this.gameState.player.stamina = this.gameState.player.maxStamina;

        setTimeout(() => this.showVillage(), 2000);
    }

    finalBattle() {
        this.cli.printLine('');
        this.cli.printLine('=======================================================', 'game-final');
        this.cli.printLine('|             [VOLCANIC PEAK]                         |', 'game-final');
        this.cli.printLine('=======================================================', 'game-final');
        this.cli.printLine('');
        this.cli.printLine('<span class="game-story">You stand at the peak of the volcano...</span>');
        this.cli.printLine('<span class="game-story">Lava flows around you. The heat is unbearable.</span>');
        this.cli.printLine('<span class="game-story">Then, you see it...</span>');
        this.cli.printLine('');
        this.cli.printLine('<span class="game-dragon">[DRAGON] THE ANCIENT DRAGON KING APPEARS! [DRAGON]</span>');
        this.cli.printLine('');
        this.cli.printLine('<span class="game-dragon-speak">"MORTAL... YOU DARE CHALLENGE ME?"</span>');
        this.cli.printLine('');

        setTimeout(() => this.startCombat('Ancient Dragon King'), 2000);
    }

    exit() {
        this.gameState.inGame = false;
        this.cli.commandInput.disabled = false;
        this.cli.printLine('');
        this.cli.printLine('<span class="game-story">Thank you for playing The Dragon Slayer!</span>');
        this.cli.printLine('');
        this.cli.printLine('--------------------------------------------------');
        this.cli.printLine('Type <strong>dragon-slayer</strong> to play again!');
        this.cli.printLine('--------------------------------------------------');
        this.cli.printLine('');
    }
}
