const https = require("https");
const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);

/**
 * @returns {Promise<require('http').IncomingMessage>}
 */
const get = (url) => new Promise((resolve, reject) => {
    https.get(url, resp => resolve(resp))
        .on('error', error => reject(error));
});

exports.onCDKResourceEvent = async (event, context) => {
    if (event.RequestType === "Create" || event.RequestType === "Update") {
        const { region, userPoolId } = event.ResourceProperties;

        return {
            Data: {
                jwks: await getUserPoolJWKS(region, userPoolId)
            }
        };
    }

    if (event.RequestType === "Delete") {
        return {};
    }

    throw new Error("Unexpected request type: " + event.RequestType);
}

/**
 * Downloads the user pool JWKS file from Amazon Cognito and writes it to the specified file.
 * Returns a promise which resolves when the file has been fully written.
 */
async function downloadUserPoolJWKS(region, userPoolId, file) {
    const writeStream = fs.createWriteStream(file);

    const completed = new Promise((resolve, reject) => {
        writeStream
            .on('finish', () => resolve())
            .on('error', error => reject(error));
    });


    const resp = await get(`https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`);
    resp.pipe(writeStream);

    return completed;
}

/**
 * Returns the JWKS (JSON Web Key Set) associated with the user pool (as a serialized JSON string).
 */
async function getUserPoolJWKS(region, userPoolId) {
    const file = '/tmp/jwks.json';
    await downloadUserPoolJWKS(region, userPoolId, file);

    return (await readFile(file)).toString();
}
