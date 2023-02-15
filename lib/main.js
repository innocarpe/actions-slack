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
const core = __importStar(require("@actions/core"));
const client_1 = require("./client");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let status = core.getInput('status', { required: true });
            status = status.toLowerCase();
            const success_text = core.getInput('success_text');
            const failure_text = core.getInput('failure_text');
            const cancelled_text = core.getInput('cancelled_text');
            core.debug(`status: ${status}`);
            core.debug(`success_text: ${success_text}`);
            core.debug(`failure_text: ${failure_text}`);
            core.debug(`cancelled_text: ${cancelled_text}`);
            const client = new client_1.Client();
            var message = '';
            switch (status) {
                case 'success':
                    message = success_text;
                    break;
                case 'failure':
                    message = failure_text;
                    break;
                case 'cancelled':
                    message = cancelled_text;
                    break;
                default:
                    throw new Error('You can specify success or failure or cancelled');
            }
            yield client.sendMessage(status, message);
        }
        catch (error) {
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            core.setFailed(errorMessage);
        }
    });
}
run();
