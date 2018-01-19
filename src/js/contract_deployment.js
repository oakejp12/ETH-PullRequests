import redis    from 'redis';
import contract from 'truffle-contract';
import Web3     from 'web3';
import path     from 'path';
import fs, { readFileSync } from 'fs';

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

// TODO: In the future, we want to set these to read from truffle.js
const HOST = 'localhost';
const PORT = '7545';

/**
 * Retrieve deployed contract address on ethereum network based on the
 * repository and owner name.
 * 
 * @param {*} repository 
 * @param {*} owner 
 * @param {*} callback 
 */
function cache(req, res, next) {
    const org = req.query.organization;

    console.log(`Retrieving contract for ${org}.`);

    client.get(org, (err, data) => {
        if (err) throw new Error(`Error retrieving contract address: ${err}`);

        if (data != null) {
            console.log('Contract data cached in Redis: \n' + data);
            res.send(data);
        } else {
            console.log(`Contract not found for ${org}`);
            next();
        }
    });
}

/**
 * Deploy a new contract Congress with the proper details from a request.
 * 
 * The proper details from the request should contain these values:
 *  req.query.org               --->    Organization (i.e. repository...)
 *  req.query.quorum            --->    Minimum number of people to participate
 *  req.query.debatingPeriod    --->    Debating period in Minutes
 *  req.query.majorityMargin    --->    Margin to add to majority (i.e. 50% + majorityMargin)
 *    
 * @param {*} req       - The request object that contrains the 
 * @param {*} res       - Send back any response...
 * @param {*} next      - NEXT! 
 * @return {*} address  - The deployed contract address
 */
function setContractDetails(req, res, next) {

    // Retrieve details needed to deploy a new Congress contract
    console.log('Request details: ');
    console.dir(req.query, { depth: null });
    
    // Retreive the compiled contract to extract the ABI and bytecode so a new instance can be deployed
    const contractPath = path.join(__dirname, '../../build/contracts/Congress.json');

    fs.readFile(contractPath, (err, data) => {
        if (err) throw new Error(`Unable to read smart contract file: ${err}`);
        
        const contents = JSON.parse(data);

        deployContract(contents.abi, contents.bytecode, req.query);
    });
}

/**
 * Deploy a new contract using the request details.
 * 
 * @param {*} abi 
 * @param {*} bytecode 
 * @param {*} options
 */
function deployContract(abi, bytecode, options) {
    console.log("Setting dynamic contract details...");

    const Congress = contract({
        abi: abi,
        unlinked_binary: bytecode
    });
    
    let web3 = (typeof web3.currentProvider !== 'undefined') ? 
        new Web3(web3.currentProvider) : 
        new Web3(new Web3.providers.HttpProvider(`http:\/\/${HOST}:${PORT}`));

    Congress.setProvider(web3.currentProvider);

    // NOTE: Dirty hack - see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
    if (typeof Congress.currentProvider.sendAsync !== "function") {
        Congress.currentProvider.sendAsync = () => {
            return Congress.currentProvider.send.apply(Congress.currentProvider, arguments);
        }
    }

    // Deploy a new smart contract with requested details...
    // TODO: Make sure options isn't null and that these options are present
    Congress.new(options.quorum, options.debatingPeriod, options.majorityMargin).then((instance) => {
        const address = instance.address;
        console.log(`Address of the newly deployed contract: ${address}.`)
        return address;
    }).then((data) => {
        // Save contract address to Redis
        console.log('Saving data to Redis: \n' + data);

        // TODO: Should we cache the other contract values as well?
        // client.set(options.org, address);
    }).catch((err) => {
        console.error('Error with deploying new smart contract: ' + err);
    });
}

export { cache, setContractDetails }