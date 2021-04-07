import * as child_process from 'child_process';
import {once} from 'events';
import {createInterface, Interface} from 'readline';
import EventEmitter = require('events');
import {HttpFileTargetsDef} from './lang-parse';


export interface DothttpRunOptions {
    noCookie?: boolean,
    experimental?: boolean,
    env?: string[],
    propertyFile?: String,
    curl: boolean
    file: string,
    target?: string,
    properties?: { [prop: string]: string },
}

interface ICommandClient {
    request(method: string, params: {}): Promise<{}>;

    stop(): void;
}

interface ICommand {
    method: string,
    id?: Number,
    params: {}
}


interface IResult {
    id: Number,
    result: {},
}

class CmdClientError extends Error {

}


abstract class BaseSpanClient implements ICommandClient {
    readonly proc: child_process.ChildProcess;
    private static count = 1; // restricts only stdserver or httpserver not both!!!!

    constructor(options: { pythonpath: string, stdargs: string[] }) {
        this.proc = child_process.spawn(options.pythonpath,
            options.stdargs,
            {stdio: ["pipe", "pipe", "inherit"]}
        );
    }

    async request(method: string, params: {}): Promise<any> {
        const id = BaseSpanClient.count++;
        const requestData = {method, params, id};
        const result = await this.call(requestData);
        if (result.id !== id) {
            throw new CmdClientError("id's are not same");
        }
        return result.result;
    }

    abstract call(command: ICommand): Promise<IResult>;

    stop(): void {
        this.proc.kill();
    }

}

export class StdoutClient extends BaseSpanClient {
    rl: Interface;
    eventS: EventEmitter = new EventEmitter();

    constructor(options: { pythonpath: string, stdargs: string[] }) {
        super(options);
        this.rl = createInterface({
            input: this.proc.stdout!,
            terminal: false
        });
        // start readline to listen
        this.rl.on("line", (line) => {
            const result: IResult = JSON.parse(line);
            this.eventS.emit(result.id + '', result);
        })
    }

    async call(command: ICommand): Promise<IResult> {
        const commandInString = JSON.stringify(command) + '\n';
        this.proc.stdin!.write(commandInString);
        const results = await once(this.eventS, command.id + '');
        // once retruns multiple at a time.
        // technically you should recive only one.
        if (results.length > 1) throw new CmdClientError("inconsistant state");
        return results[0] as unknown as IResult;
    }
}


export type TargetSymbolInfo = {
    name: string;
    start: number;
    end: number;
    method: string;
};


export type UrlSymbolInfo = {
    start: number;
    url: string;
    method: string;
    end: number;
};

export interface DotTttpSymbol {
    names?: Array<TargetSymbolInfo>,
    urls?: Array<UrlSymbolInfo>,
    error?: boolean,
    error_message?: string,
}


export class ClientHandler {
    cli: BaseSpanClient;
    static fileExecuteCommand = "/file/execute";
    static contentExecutecommand = "/content/execute";
    static namescommand = "/file/names";
    static importPostman = "/import/postman";
    static generateLangHttp = "/file/parse";

    constructor(path: string) {
        const options = {stdargs: []} as unknown as { pythonpath: string, stdargs: string[] };
        options.pythonpath = path;
        console.log("launch params", JSON.stringify(options));
        this.cli = new StdoutClient(options);
    }

    async executeFile(options: DothttpRunOptions) {
        return await this.cli.request(ClientHandler.fileExecuteCommand, {
            file: options.file,
            env: options.env,
            properties: options.properties,
            nocookie: options.noCookie,
            target: options.target,
            curl: options.curl,
        })
    }

    async executeContent(options: DothttpRunOptions & { content?: string }) {
        return await this.cli.request(ClientHandler.contentExecutecommand, {
            content: options.content,
            env: options.env,
            properties: options.properties,
            nocookie: options.noCookie,
            target: options.target,
            curl: options.curl,
        })
    }

    async importPostman(options: { link: string, directory: string, save: boolean }) {
        return await this.cli.request(ClientHandler.importPostman, options)
    }

    async getTargetsInHttpFile(filename: string, source?: string): Promise<DotTttpSymbol> {
        return await this.cli.request(ClientHandler.namescommand, {file: filename, source: source || 'default'})
    }

    async generateLangHttp(options: DothttpRunOptions & { content: string }): Promise<HttpFileTargetsDef> {
        return await this.cli.request(ClientHandler.generateLangHttp, {
            content: options.content,
            env: options.env,
            file: options.file,
            properties: options.properties,
            nocookie: options.noCookie,
            target: options.target,
        })
    }

    close() {
        this.cli.stop();
    }
}