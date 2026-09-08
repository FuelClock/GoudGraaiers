// Bounty Board Script for SinusBot
// A simple bounty system where authorized players can place bounties on others.
// Bounties are sorted by gold amount (highest first) and displayed in a configurable channel.

registerPlugin({
    name: 'Bounty Board',
    version: '1.0.0',
    author: 'Guild Admin',
    description: 'Simple bounty board system for sea battle guilds',
    backends: ['ts3'],
    vars: [
        {
            name: 'BOT_NAME',
            title: 'Bot Command Name',
            type: 'string',
            default: 'bounty'
        },
        {
            name: 'AUTHORIZED_GROUP',
            title: 'Server Group ID (authorized to place bounties)',
            type: 'string',
            default: '3'
        },
        {
            name: 'DISPLAY_CHANNEL_ID',
            title: 'Channel ID (display bounty board in description)',
            type: 'string',
            default: '5'
        },
        {
            name: 'BOT_ADMIN_GROUP',
            title: 'Server Group ID (authorized to remove bounties and manage)',
            type: 'string',
            default: '2'
        },
        {
            name: 'MAX_ACTIVE_BOUNTIES',
            title: 'Maximum active bounties at once',
            type: 'number',
            default: 50
        },
        {
            name: 'DISPLAY_FORMAT',
            title: 'Channel Description Format',
            type: 'string',
            default: '[center][b][color=#FFD700]\uD83D\uDC51 BOUNTY BOARD\uD83D\uDC51[/color][/b][/center]\n[center]Gold Available: [color=#00FF00]{totalGold}[/color][/center]\n{bountyList}[/center]'
        },
        {
            name: 'AUTO_REFRESH_INTERVAL',
            title: 'Auto-refresh channel description (seconds, 0 = off)',
            type: 'number',
            default: 30
        }
    ],
    varsConfig: {
        allowWeb: true
    }
});

var bountyBoard = [];
var botName = '';
var authorizedGroupId = '';
var displayChannelId = '';
var botAdminGroupId = '';
var maxBounties = 50;
var autoRefreshInterval = 30;
var displayFormat = '';
var refreshTimer = null;
var displayChannelName = '';

function initialize() {
    // Load configuration values from bot instance
    botName = engine.getConfig('BOT_NAME') || 'bounty';
    authorizedGroupId = engine.getConfig('AUTHORIZED_GROUP') || '3';
    displayChannelId = engine.getConfig('DISPLAY_CHANNEL_ID') || '5';
    botAdminGroupId = engine.getConfig('BOT_ADMIN_GROUP') || '2';
    maxBounties = parseInt(engine.getConfig('MAX_ACTIVE_BOUNTIES')) || 50;
    autoRefreshInterval = parseInt(engine.getConfig('AUTO_REFRESH_INTERVAL')) || 30;
    displayFormat = engine.getConfig('DISPLAY_FORMAT') || '[center][b][color=#FFD700]\uD83D\uDC51 BOUNTY BOARD\uD83D\uDC51[/color][/b][/center]\n{bountyList}[/center]';

    // Load persisted data if available
    if (engine.exists('bountyData')) {
        try {
            bountyBoard = JSON.parse(engine.get('bountyData'));
        } catch(e) {
            bountyBoard = [];
        }
    }

    // Register commands
    registerCommands();
    
    // Start auto-refresh if enabled
    if (autoRefreshInterval > 0) {
        startAutoRefresh();
    }

    // Initial display update
    updateChannelDescription();

    engine.log('Bounty Board initialized. ' + bountyBoard.length + ' bounties loaded.');
}

function registerCommands() {
    // Command Library is assumed to be installed. Register via command library.
    // If command library is not available, fall back to onPrivateChat/onChatMessage handlers
    
    var commandLibrary = engine.get('CommandLibrary');
    if (commandLibrary) {
        commandLibrary.registerCommand('bounty', 'Places or manages bounties. Usage: !bounty <player> <gold> <reason>', ['ALL'], true);
        commandLibrary.registerCommand('bounty remove', 'Removes a bounty by index. Usage: !bounty remove <index>', ['ADMINS']);
        commandLibrary.registerCommand('bounty clear', 'Clears all bounties. Usage: !bounty clear', ['ADMINS']);
        commandLibrary.registerCommand('bounty list', 'Displays the current bounty board', ['ALL']);
    }
}

function onChatMessage(event) {
    var text = event.text;
    var invoker = event.invoker;
    
    // Check if message starts with our command
    var prefix = '!' + botName + ' ';
    var prefixAlt = '/' + botName + ' ';
    
    var cmdText = text;
    if (text.startsWith(prefix)) {
        cmdText = text.substring(prefix.length);
    } else if (text.startsWith(prefixAlt)) {
        cmdText = text.substring(prefixAlt.length);
    } else {
        return; // Not our command
    }
    
    handleCommand(cmdText, invoker, event);
}

function onPrivateChatMessage(event) {
    var text = event.text;
    var invoker = event.invoker;
    
    var prefix = '!' + botName + ' ';
    if (text.startsWith(prefix)) {
        handleCommand(text.substring(prefix.length), invoker, event);
    }
}

function handleCommand(args, invoker, event) {
    // Check if invoker has the authorized group
    var invokerGroups = invoker.serverGroups;
    var isAuthorized = false;
    var isAdmin = false;
    
    for (var i = 0; i < invokerGroups.length; i++) {
        var groupId = invokerGroups[i].id;
        if (groupId == authorizedGroupId) {
            isAuthorized = true;
        }
        if (groupId == botAdminGroupId) {
            isAdmin = true;
        }
    }
    
    // Admin bypass
    if (!isAdmin && !isAuthorized) {
        invoker.privateChatMessage('You do not have permission to use the bounty board. Required group ID: ' + authorizedGroupId);
        return;
    }
    
    // Parse command
    var parts = args.trim().split(/\s+/);
    var subCommand = parts[0].toLowerCase();
    
    if (subCommand === 'remove' && parts.length >= 2) {
        if (!isAdmin) {
            invoker.privateChatMessage('Only admins can remove bounties.');
            return;
        }
        var index = parseInt(parts[1]);
        if (isNaN(index) || index < 0 || index >= bountyBoard.length) {
            invoker.privateChatMessage('Invalid bounty index. Use !bounty list to see available bounties.');
            return;
        }
        var removed = bountyBoard.splice(index, 1);
        saveData();
        invoker.privateChatMessage('Removed bounty: ' + removed[0].target + ' (' + removed[0].gold + ' gold)');
        updateChannelDescription();
        return;
    }
    
    if (subCommand === 'clear') {
        if (!isAdmin) {
            invoker.privateChatMessage('Only admins can clear bounties.');
            return;
        }
        bountyBoard = [];
        saveData();
        invoker.privateChatMessage('All bounties cleared.');
        updateChannelDescription();
        return;
    }
    
    if (subCommand === 'list') {
        displayBountyList(invoker);
        return;
    }
    
    // Default: place a bounty
    // args format: <playername> <gold> <reason>
    if (parts.length < 3) {
        invoker.privateChatMessage('Usage: !bounty <playername> <gold_amount> <reason>');
        return;
    }
    
    var playerName = parts[0];
    var goldAmount = parseInt(parts[1]);
    var reason = parts.slice(2).join(' ');
    
    if (isNaN(goldAmount) || goldAmount <= 0) {
        invoker.privateChatMessage('Invalid gold amount. Must be a positive number.');
        return;
    }
    
    if (playerName.toLowerCase() === invoker.nickname.toLowerCase()) {
        invoker.privateChatMessage('You cannot put yourself on the bounty board!');
        return;
    }
    
    if (bountyBoard.length >= maxBounties) {
        invoker.privateChatMessage('Bounty board is full! Maximum ' + maxBounties + ' active bounties.');
        return;
    }
    
    // Create bounty entry
    var bountyEntry = {
        id: Date.now(),
        target: playerName,
        gold: goldAmount,
        reason: reason,
        postedBy: invoker.nickname,
        postedAt: new Date().toISOString()
    };
    
    bountyBoard.push(bountyEntry);
    saveData();
    sortBounties();
    updateChannelDescription();
    
    // Confirmation to invoker
    invoker.privateChatMessage('Bounty placed on ' + playerName + ' for ' + goldAmount + ' gold! Reason: ' + reason);
    
    // Channel announcement
    var announceChannel = engine.getChannel(displayChannelId);
    if (announceChannel) {
        announceChannel.sendMessage(invoker.nickname + ' has placed a bounty on ' + playerName + ' for ' + goldAmount + ' gold!');
    }
}

function sortBounties() {
    // Sort descending by gold amount
    bountyBoard.sort(function(a, b) {
        return b.gold - a.gold;
    });
}

function saveData() {
    engine.set('bountyData', JSON.stringify(bountyBoard));
}

function displayBountyList(invoker) {
    if (bountyBoard.length === 0) {
        invoker.privateChatMessage('The bounty board is currently empty.');
        return;
    }
    
    var msg = '[center][b][color=#FFD700]BOUNTY BOARD[/color][/b][/center]';
    msg += '\\n[center][b]Active Bounties: ' + bountyBoard.length + '[/b][/center]\\n';
    
    for (var i = 0; i < bountyBoard.length; i++) {
        var b = bountyBoard[i];
        var dateStr = new Date(b.postedAt).toLocaleDateString();
        msg += '\\n[color=#FFD700][' + (i+1) + '][/color] [color=#FF6347]' + b.target + '[/color] - [color=#00FF00]' + b.gold + ' gold[/color]';
        msg += '\\n  Reason: ' + b.reason + ' (Posted by ' + b.postedBy + ' on ' + dateStr + ')';
    }
    
    msg += '\\n[center]\\nUsage: !bounty <player> <gold> <reason>[/center]';
    msg += '\\n[center]Admins: !bounty remove <index> | !bounty clear[/center]';
    msg += '\\n[center][/center]';
    
    invoker.privateChatMessage(msg);
}

function updateChannelDescription() {
    var channel = engine.getChannel(displayChannelId);
    if (!channel) {
        engine.log('Warning: Display channel ' + displayChannelId + ' not found.');
        return;
    }
    
    displayChannelName = channel.name;
    
    var totalGold = 0;
    for (var i = 0; i < bountyBoard.length; i++) {
        totalGold += bountyBoard[i].gold;
    }
    
    // Build the bounty list HTML/BBCode for channel description
    var bountyList = '';
    for (var i = 0; i < bountyBoard.length && i < 15; i++) {
        var b = bountyBoard[i];
        var rankColor = i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#FFFFFF';
        bountyList += '[color=' + rankColor + '][' + (i+1) + '. ' + b.target + ' - ' + b.gold + ' gold][/color]\\n';
    }
    
    if (bountyBoard.length === 0) {
        bountyList = '[color=#808080]No active bounties[/color]';
    } else if (bountyBoard.length > 15) {
        bountyList += '[color=#808080]... and ' + (bountyBoard.length - 15) + ' more[/color]\\n';
    }
    
    // Replace placeholders in display format
    var description = displayFormat
        .replace(/{totalGold}/g, totalGold)
        .replace(/{bountyList}/g, bountyList);
    
    // Update channel description
    try {
        channel.setDescription(description);
    } catch(e) {
        engine.log('Failed to update channel description: ' + e.message);
    }
}

function startAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
    refreshTimer = setInterval(function() {
        updateChannelDescription();
    }, autoRefreshInterval * 1000);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// Handle bot startup
engine.on('start', initialize);
engine.on('stop', stopAutoRefresh);

// Fallback: register chat handlers directly if Command Library not available
engine.on('chatMessage', function(event) {
    var text = event.text;
    var prefix = '!' + botName + ' ';
    if (text.startsWith(prefix)) {
        handleCommand(text.substring(prefix.length), event.invoker, event);
    }
});
