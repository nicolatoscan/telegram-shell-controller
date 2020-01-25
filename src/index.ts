import * as dotenv from 'dotenv';
import { exec, ExecOptions } from 'child_process'
dotenv.config();

import Telegram, { ContextMessageUpdate } from "telegraf"


class Bot {
    private bot: Telegram<ContextMessageUpdate>;
    private cwd: string = null

    constructor() {
        this.bot = new Telegram(process.env.BOT_TOKEN)
        this.middleware()
        this.bot.launch()

    }

    private middleware(): void {
        this.bot.start(ctx => ctx.reply("Hello There"))
        this.bot.help(ctx => ctx.reply("Hello There"))
        this.bot.command("/ping", ctx => ctx.reply("pong!"))
        this.bot.command("/cd", ctx => this.setCwd(ctx))
        this.bot.on("message", ctx => this.sendCommand(ctx))

    }

    private setCwd(ctx: ContextMessageUpdate) {
        if (ctx.message.text.length <= 5)
            this.cwd = null;
        else
            this.cwd = ctx.message.text.slice(5)
    }

    private async sendCommand(ctx: ContextMessageUpdate) {
        console.log(ctx.message.text)

        if (ctx.message.text.indexOf("cd ") == 0) {
            this.cwd = ctx.message.text.slice(3)
            ctx.reply(this.cwd);
            return;
        }

        
        let prop: ExecOptions = {}
        if (this.cwd)
            prop.cwd = this.cwd;

        const { stdout, stderr } = await exec(ctx.message.text, prop);
        stdout.on("data", data => ctx.reply(data))
        stderr.on("data", data => ctx.reply("Error\n" + data))
    }
}

const bot = new Bot();