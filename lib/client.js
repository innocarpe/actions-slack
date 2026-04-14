"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Client = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const webhook_1 = require("@slack/webhook");
class Client {
    constructor() {
        if (process.env.GITHUB_TOKEN === undefined) {
            throw new Error('Specify secrets.GITHUB_TOKEN');
        }
        this.github = github.getOctokit(process.env.GITHUB_TOKEN);
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
                    title: 'GitHub Actions',
                    value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks|Workflow>`,
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
