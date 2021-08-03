const cp = require('child_process');
const util = require('util');
const fs = require('fs');

test('CognitoUserPoolJWKSQuery.getJWKS() returns valid JSON data', () => {
    if (fs.existsSync('./cfn-outputs.json')) {
        fs.unlinkSync('./cfn-outputs.json');
    }


    cp.execSync('npx cdk deploy --force --outputs-file cfn-outputs.json');

    expect(fs.existsSync('./cfn-outputs.json')).toBe(true);

    const outputs = JSON.parse(fs.readFileSync('./cfn-outputs.json').toString());

    expect(outputs?.TestStack?.UserPoolJWKS).toBeTruthy();
});
