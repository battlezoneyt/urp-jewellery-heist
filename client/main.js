import Core from 'urp-core';
import * as natives from 'natives';
import * as alt from 'alt-client';

import { START_HEIST, COORDS_LIST } from '../shared/config';

let isStarted = false;
let cds = 0;
let robbed = false;


alt.onServer('start:heist', () =>{
    isStarted = true;
    alt.emit('notify', 'important', 'Jewel Heist', 'Jewel Heist Stated');
    // Sends to all players.
})



alt.on('keydown', (key) => {
    let scriptID = alt.Player.local.scriptID;
    let diststartJob = alt.Player.local.pos.distanceTo(START_HEIST) < 2.5;
    let dist = alt.Player.local.pos.distanceTo(COORDS_LIST[cds]) < 0.5;
    if (key == 69 && diststartJob && !isStarted) {
            alt.emitServer('copsAvailable');
    }
    if (key == 69 && isStarted && dist && !robbed) {
        robbed = true;
        natives.disableAllControlActions(1);
        Core.Functions.loadAnim('missheist_jewel');
        natives.taskPlayAnim(
            alt.Player.local.scriptID,
            'missheist_jewel',
            '"smash_case',
            3.0,
            -3.0,
            -1,
            120,
            0,
            0,
            0,
            0
        );
        alt.setTimeout(() => {
            natives.clearPedTasksImmediately(scriptID);
            natives.disableAllControlActions(0);
        alt.emitServer('addHeist:reward');
        }, 5000);
    }
});

alt.everyTick(async () => {
    if (!isStarted) return;
    if (!robbed) return;
    robbed = false;
    if (cds >= COORDS_LIST.length-1){
        isStarted = false; 
        cds= 0;
        robberywait = true;
        return;
    }
        cds = cds+1;
        console.log(cds);
});

alt.everyTick(async () => {
    if (!isStarted) return;
    let dist = alt.Player.local.pos.distanceTo(COORDS_LIST[cds]) < 0.5;
    if (!dist || robbed) return;
    drawMarker(COORDS_LIST[cds]);
    Core.Utils.drawTextHelper('PRESS ~r~E~w~ TO SMASH', 0.5, 0.93);
});


function drawMarker(pos) {
    natives.drawMarker(
        21,
        pos.x,
        pos.y,
        pos.z - 0,
        0,
        0,
        0,
        0,
        180,
        0,
        0.5,
        0.5,
        0.5,
        0,
        0,
        255,
        50,
        true,
        true,
        2,
        1,
        0,
        0,
        false
    );
}

