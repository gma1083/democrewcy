/* 
 * noomman.js
 * The main file for noomman. Imports and exports all portions of noomman which 
 *    should be made available to users of this library. Noomman code should be 
 *    required through this file, rather than individually, except by internal 
 *    noomman files.
 */ 

const ClassModel = require('./noomman/ClassModel');
const Instance = require('./noomman/Instance');
const InstanceSet = require('./noomman/InstanceSet');
const NoommanErrors = require('./noomman/NoommanErrors');
const database = require('./noomman/database');

module.exports = {
    ClassModel,
    Instance,
    InstanceSet,
    NoommanErrors,
    connect: database.connect,
    close: database.close,
	connected: database.connected,
	ObjectId: database.ObjectId,
}