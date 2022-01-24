import Core from 'urp-core';
import * as alt from 'alt-server';
import * as chat from 'urp-chat';

import { MIN_COPS } from '../shared/config';

alt.onClient('addHeist:reward', (source) => {
    Core.Money.addMoney(source, 'cash', 25);
    alt.emitClient(source, 'notify', 'success', 'payment', 'you received $25');
});


alt.onClient('copsAvailable', (source) => {
    let availablecops = 0;
    if (!source || !source.valid) {
        return;
    }
    const playerList = alt.Player.all;
    playerList.forEach((player) => {
        const playerjob = Core.Functions.getPlayerData(player, 'job');
        if (playerjob.name === "police" && playerjob.onDuty) availablecops = availablecops + 1;
    });
    if(availablecops >= MIN_COPS) {
        chat.broadcast(`{5555AA}LAW & ORDER {FFFFFF}Jewel Heist Stated`);
        alt.emitClient(source, 'start:heist');
    }
});

