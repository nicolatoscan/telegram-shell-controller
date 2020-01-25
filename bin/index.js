"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const child_process_1 = require("child_process");
dotenv.config();
const telegraf_1 = require("telegraf");
class Bot {
    constructor() {
        this.cwd = null;
        this.bot = new telegraf_1.default(process.env.BOT_TOKEN);
        this.middleware();
        this.bot.launch();
    }
    middleware() {
        this.bot.start(ctx => ctx.reply("Hello There"));
        this.bot.help(ctx => ctx.reply("Hello There"));
        this.bot.command("/ping", ctx => ctx.reply("pong!"));
        this.bot.command("/cd", ctx => this.setCwd(ctx));
        this.bot.on("message", ctx => this.sendCommand(ctx));
    }
    setCwd(ctx) {
        if (ctx.message.text.length <= 5)
            this.cwd = null;
        else
            this.cwd = ctx.message.text.slice(5);
    }
    sendCommand(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(ctx.message.text);
            if (ctx.message.text.indexOf("cd ") == 0) {
                this.cwd = ctx.message.text.slice(3);
                ctx.reply(this.cwd);
                return;
            }
            let prop = {};
            if (this.cwd)
                prop.cwd = this.cwd;
            const { stdout, stderr } = yield child_process_1.exec(ctx.message.text, prop);
            stdout.on("data", data => ctx.reply(data));
            stderr.on("data", data => ctx.reply("Error\n" + data));
        });
    }
}
const bot = new Bot();
