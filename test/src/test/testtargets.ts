import {ClientHandler} from "../index";
import {assert, expect} from 'chai';
import expected from './target.json';
import * as fs from "fs";
import * as path from 'path';

// "c:\\Users\\Neptune\\AppData\\Roaming\\Code\\User\\globalStorage\\shivaprasanth.dothttp-code\\cli\\cli\\cli.exe"
const exePath = path.resolve(process.env.CLI_PATH!);
console.log(`path specified is ${exePath}`);
const client = new ClientHandler(exePath);

let multipart = path.join(__dirname, "..", "..", "fixtures", "multipart.http");
let simple = path.join(__dirname, "..", "..", "fixtures", "simple.http");
console.log(`files path is ${multipart} ${simple}`);
before(async () => {
})
describe('test target', function () {
    it('get target', async function () {
        const target = await client.getTargetsInHttpFile(simple);
        assert.isFalse(target.error ?? false)
        assert.deepEqual(target, expected)
    })

    it('execute target', async function () {
        let out = await client.executeFile({curl: false, "file": simple});
        assert.isFalse(out.error ?? false)
        assert.equal(out.http, `@name("1")
POST "https://httpbin.org/post"
json({
    "simpel test": "with repeated names"
})


`);
        assert.equal(out.status, 200);
        expect(out.headers).to.be.an('object')
        let simpledd = JSON.parse(out.body);
        assert.equal(simpledd.url, "https://httpbin.org/post")
        assert.deepEqual(simpledd.args, {})
        assert.deepEqual(simpledd.json, {
            "simpel test": "with repeated names"
        })
    })

    it('multipart target', async function () {
        let out = await client.executeFile({
            curl: false,
            "file": multipart,
            properties: {
                "file1": multipart,
                "file2": multipart
            }
        });
        let buffer = fs.readFileSync(multipart, {encoding: 'utf8', flag: 'r'}).toString();
        let simpledd = JSON.parse(out.body);
        assert.deepEqual(simpledd["files"].file1, buffer);
        assert.deepEqual(simpledd["files"].file2, buffer);

        assert.equal((simpledd["headers"]["Content-Type"] as string).startsWith("multipart/form-data; boundary="), true);

        assert.equal(simpledd["form"].text1, "simple text");
        assert.equal(simpledd["form"].text2, "simple text with content-type");


        assert.deepEqual(simpledd["args"], {});
        assert.equal(simpledd.data, "");
        assert.equal(simpledd.json, null);
        assert.equal(simpledd.url, "https://httpbin.org/post");

    })

})

after(async () => {
    client.close()
})