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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const webhook_1 = require("@slack/webhook");
class Client {
    constructor() {
        if (process.env.GITHUB_TOKEN === undefined) {
            throw new Error('Specify secrets.GITHUB_TOKEN');
        }
        this.github = new github.GitHub(process.env.GITHUB_TOKEN);
        if (process.env.SLACK_WEBHOOK_URL === undefined) {
            throw new Error('Specify secrets.SLACK_WEBHOOK_URL');
        }
        this.webhook = new webhook_1.IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
    }
    sendMessage(status, text) {
        return __awaiter(this, void 0, void 0, function* () {
            var color = '';
            switch (status) {
                case 'success':
                    color = 'good';
                    break;
                case 'failure':
                    color = 'danger';
                    break;
                case 'cancelled':
                    color = 'warning';
                    break;
                default:
                    throw new Error('The status must be success or failure or cancelled');
            }
            const payload = {
                text: text,
                attachments: [
                    {
                        color: color,
                        fields: yield this.fields(),
                    },
                ],
            };
            this.send(payload);
        });
    }
    fields() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.github === undefined) {
                throw Error('Specify secrets.GITHUB_TOKEN');
            }
            const { owner, repo } = github.context.repo;
            const { sha } = github.context;
            return [
                {
                    title: 'GitHub Action',
                    value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks|Link>`,
                }
            ];
        });
    }
    send(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            core.debug(JSON.stringify(github.context, null, 2));
            yield this.webhook.send(payload);
            core.debug('send message');
        });
    }
}
exports.Client = Client;
