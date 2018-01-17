import redis    from 'redis';
import contract from 'truffle-contract';
import Web3     from 'web3';
import path     from 'path'
import fs, { readFileSync } from 'fs';

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

const web3Provider = (typeof web3Provider !== 'undefined') ? web3Provider : new Web3.providers.HttpProvider('http://localhost:7545');

/**
 * Retrieve deployed contract address on ethereum network based on the
 * repository and owner name.
 * 
 * @param {*} repository 
 * @param {*} owner 
 * @param {*} callback 
 */
let cache = (req, res, next) => {
    const org = req.query.organization;

    client.get(org, (err, data) => {
        if (err) throw new Error(`Error retrieving contract address: ${err}`);

        if (data != null) {
            res.send(data);
        } else {
            next();
        }
    });
}

/**
 * Deploy a new contract Congress with the proper details
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @return {*} address - The deployed contract address
 */
let setContractDetails = (req, res, next) => {
    console.log("Setting dynamic contract details...");
    
    // Retrieve details needed to deploy a new Congress contract
    console.dir(req.query, { depth: null });
    const org                       = req.query.organization;
    const minimumQuorum             = req.query.minimumQuorum;
    const debatingPeriodInMinutes   = req.query.debatingPeriodInMinutes;
    const majorityMargin            = req.query.majorityMargin;
    
    // Retreive the compiled contract to extract the ABI and bytecode so a new instance can be deployed
    const contractPath = path.join(__dirname, '../../build/contracts/Congress.json');
    const sourceCode = JSON.parse(fs.readFileSync(contractPath));

    // TODO: Look into await/async method since this is return undefined at the moment...
    // const contents = fs.readFileSync('./build/contracts/Congress.json', (err, data) => {
    //     if (err) throw new Error(`Unable to read smart contract abi: ${err}`);
    //     return JSON.parse(data);
    // });

    const Congress = contract({
        abi: sourceCode.abi,
        unlinked_binary: sourceCode.bytecode
    });
    
    Congress.setProvider(web3Provider);

    // Deploy a new smart contract with requested details...
    Congress.new(minimumQuorum, debatingPeriodInMinutes, majorityMargin).then((instance) => {
        const address = instance.address;
        console.log(`Address of the newly deployed contract: ${address}.`)
        return address;
    }).then((data) => {
        // Save contract address to Redis
        // TODO: Should we cache the other contract values as well?
        client.set(org, address);
    });
}

module.exports = {
    cache : cache,
    setContractDetails : setContractDetails
}