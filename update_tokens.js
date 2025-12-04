const { execSync } = require('child_process');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const ENV_PATH = path.join(__dirname, '.env');
const FRONTEND_ENV_PATH = path.join(__dirname, 'apps/frontend/.env.local');
const LEDGER_ID = 'sandbox';
const SECRET = 'secret';

function getPartyIds() {
    try {
        console.log('Fetching parties from ledger...');
        // Run daml ledger list-parties
        // We assume daml is in PATH or we might need to source it. 
        // Since this script is called from start_sequential.sh which exports PATH, it should work.
        const output = execSync('daml ledger list-parties --host localhost --port 5011', { encoding: 'utf-8' });

        const parties = {};
        const lines = output.split('\n');

        lines.forEach(line => {
            // Output format example:
            // PartyDetails {party = 'Admin::...', displayName = "Admin", isLocal = True}

            const partyIdMatch = line.match(/party = '([^']+)'/);
            const displayNameMatch = line.match(/displayName = "([^"]+)"/);

            if (partyIdMatch && displayNameMatch) {
                const partyId = partyIdMatch[1];
                const displayName = displayNameMatch[1];
                parties[displayName] = partyId;
            }
        });

        return parties;
    } catch (error) {
        console.error('Error fetching parties:', error.message);
        process.exit(1);
    }
}

function generateToken(partyId, role) {
    const payload = {
        "https://daml.com/ledger-api": {
            "ledgerId": LEDGER_ID,
            "applicationId": "cantara-backend",
            "actAs": [partyId],
            "readAs": [partyId]
        },
        "iat": Math.floor(Date.now() / 1000)
    };
    return jwt.sign(payload, SECRET, { algorithm: 'HS256' });
}

function updateEnvFile(tokens, parties) {
    try {
        // 1. Update Root .env
        let envContent = '';
        if (fs.existsSync(ENV_PATH)) {
            envContent = fs.readFileSync(ENV_PATH, 'utf-8');
        }

        // Update or append tokens
        const tokenMap = {
            'Admin': 'CANTARA_DAML_ADMIN_TOKEN',
            'User': 'CANTARA_DAML_USER_TOKEN',
            'OracleUpdater': 'CANTARA_DAML_ORACLE_TOKEN',
            'Liquidator': 'CANTARA_DAML_LIQUIDATOR_TOKEN'
        };

        if (tokens['InstitutionDemo']) {
            tokenMap['InstitutionDemo'] = 'CANTARA_DAML_INSTITUTION_TOKEN';
        } else if (tokens['Institution']) {
            tokenMap['Institution'] = 'CANTARA_DAML_INSTITUTION_TOKEN';
        }

        Object.entries(tokens).forEach(([role, token]) => {
            const envVar = tokenMap[role];
            if (envVar) {
                const regex = new RegExp(`^${envVar}=.*`, 'm');
                if (regex.test(envContent)) {
                    envContent = envContent.replace(regex, `${envVar}=${token}`);
                } else {
                    envContent += `\n${envVar}=${token}`;
                }
                console.log(`Updated ${envVar}`);
            }
        });

        // Also ensure LEDGER_ID is correct
        const ledgerRegex = /^CANTARA_DAML_LEDGER_ID=.*/m;
        if (ledgerRegex.test(envContent)) {
            envContent = envContent.replace(ledgerRegex, `CANTARA_DAML_LEDGER_ID=${LEDGER_ID}`);
        } else {
            envContent += `\nCANTARA_DAML_LEDGER_ID=${LEDGER_ID}`;
        }

        fs.writeFileSync(ENV_PATH, envContent);
        console.log('.env file updated successfully');

        // 2. Update Frontend .env.local
        let frontendEnvContent = '';
        if (fs.existsSync(FRONTEND_ENV_PATH)) {
            frontendEnvContent = fs.readFileSync(FRONTEND_ENV_PATH, 'utf-8');
        }

        // Update NEXT_PUBLIC_CANTARA_USER_PARTY_ID
        const userPartyId = parties['User'];
        if (userPartyId) {
            const userPartyRegex = /^NEXT_PUBLIC_CANTARA_USER_PARTY_ID=.*/m;
            if (userPartyRegex.test(frontendEnvContent)) {
                frontendEnvContent = frontendEnvContent.replace(userPartyRegex, `NEXT_PUBLIC_CANTARA_USER_PARTY_ID=${userPartyId}`);
            } else {
                frontendEnvContent += `\nNEXT_PUBLIC_CANTARA_USER_PARTY_ID=${userPartyId}`;
            }
            console.log(`Updated NEXT_PUBLIC_CANTARA_USER_PARTY_ID in frontend`);
        }

        const demoInstitutionPartyId = parties['InstitutionDemo'] || parties['Institution'];
        if (demoInstitutionPartyId) {
            const demoPartyRegex = /^NEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_PARTY_ID=.*/m;
            if (demoPartyRegex.test(frontendEnvContent)) {
                frontendEnvContent = frontendEnvContent.replace(demoPartyRegex, `NEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_PARTY_ID=${demoInstitutionPartyId}`);
            } else {
                frontendEnvContent += `\nNEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_PARTY_ID=${demoInstitutionPartyId}`;
            }
            console.log(`Updated NEXT_PUBLIC_CANTARA_DEMO_INSTITUTION_PARTY_ID in frontend`);
        }

        fs.writeFileSync(FRONTEND_ENV_PATH, frontendEnvContent);
        console.log('Frontend .env.local updated successfully');

    } catch (error) {
        console.error('Error updating .env file:', error.message);
        process.exit(1);
    }
}

function main() {
    const parties = getPartyIds();
    console.log('Found parties:', parties);

    const requiredRoles = ['Admin', 'User', 'OracleUpdater', 'Liquidator'];
    const tokens = {};

    requiredRoles.forEach(role => {
        const partyId = parties[role];
        if (partyId) {
            tokens[role] = generateToken(partyId, role);
        } else {
            console.warn(`Warning: Party ID for role '${role}' not found in ledger.`);
        }
    });

    const institutionPartyName = parties['InstitutionDemo'] ? 'InstitutionDemo' : (parties['Institution'] ? 'Institution' : null);
    if (institutionPartyName) {
        tokens[institutionPartyName] = generateToken(parties[institutionPartyName], institutionPartyName);
    } else {
        console.warn("Warning: Institution party not found; CANTARA_DAML_INSTITUTION_TOKEN will not be updated.");
    }

    updateEnvFile(tokens, parties);
}

main();
