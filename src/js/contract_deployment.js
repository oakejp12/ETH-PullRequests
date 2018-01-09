import redis    from 'redis';
import contract from 'truffle-contract';
import web3     from 'web3';
import fs from 'fs';

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const web3Provider = (web3Provider !== 'undefined') ? 
    web3.currentProvider 
    : new Web3.providers.HttpProvider('http://localhost:7545');


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
    
    // Retrieve details needed to deploy a new Congress contract
    const org                       = req.query.organization;
    const minimumQuorum             = req.query.minimumQuorum;
    const debatingPeriodInMinutes   = req.query.debatingPeriodInMinutes;
    const majorityMargin            = req.query.majorityMargin;

    // TODO: Deploy contract to retrieve contract address
    // TODO: Use truffle-contract --> MyContract.new()
    
    // Read in smart contract ABI from build folder
    const contents = fs.readFile('../../build/contracts/Congress.json', (err, data) => {
        if (err) throw new Error(`Unable to read smart contract abi: ${err}`);

        return JSON.parse(data);
    });
    
    const Congress = contract({abi: contents});
    Congress.setProvider(web3Provider);

    const address = Congress.new(minimumQuorum, debatingPeriodInMinutes, majorityMargin).then((instance) => {
        return instance.address;
    });

    // Save contract address to Redis
    // TODO: Should we cache the other contractvalues as well?
    const client = redis.createClient(REDIS_PORT);
    client.set(org, address);
}

module.exports = {
    cache : cache,
    setContractDetails : setContractDetails
}