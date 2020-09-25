const express = require('express');
const router = express.Router();
const azure = require("azure-storage");
const shortid = require('shortid');
const table = 'links';
const entGen = azure.TableUtilities.entityGenerator;

router.get("/", function (req, res) {
    res.send("This is our new homepage");
});

router.get("/about", function (req, res) {
    res.send("Very cool tool, multi pages even work");
});

router.get("/chris", function (req, res) {
    res.send("Chris is a cool guy");
});

router.route("/generate").post(function (req, res) {
    const { url } = req.body;
    let code = shortid.generate();
    generateCodeUntilSuccess(code, url).then((c) => {
        res.status(200).send('https://dailydevtips.azurewebsites.net/' + c);
    });
});

router.route("/:uniqueId").get(function (req, res) {
    const uniqueId = req.params.uniqueId;
    getRecord(uniqueId).then(url => {
        res.redirect(301, url);
    }).catch(err => {
        res.status(400).send("Error: Code not found");
    });
});

function getRecord(uniqueId) {
    return new Promise(function (resolve, reject) {
        try {
            var tableService = azure.createTableService();
            var query = new azure.TableQuery().top(1).where("RowKey eq ?", uniqueId);
            tableService.queryEntities(table, query, null, function (error, result, response) {
                if (!error) {
                    if (result.entries[0] !== undefined) {
                        resolve(result.entries[0].Url._);
                    } else {
                        reject('code not found');
                    }
                } else {
                    reject(error);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function generateCodeUntilSuccess(code, url) {
    return await addLink(code, url).then((c) => {
        return c;
    }).catch((e) => {
        generateCodeUntilSuccess(shortid.generate(), url);
    });
}

function addLink(code, url) {
    return new Promise((resolve, reject) => {
        try {
            var tableService = azure.createTableService();
            var query = new azure.TableQuery().top(1).where("RowKey eq ?", code);
            tableService.queryEntities(table, query, null, function (error, result, response) {
                if (!error) {
                    var link = {
                        PartitionKey: entGen.String('link_' + code),
                        RowKey: entGen.String(code),
                        Url: entGen.String(url),
                    };
                    tableService.insertEntity(table, link, function (error, result, response) {
                        if (!error) {
                            resolve(code);
                        }
                        reject(error);
                    });
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = router;