/// <reference types="socket.io" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { Handler } from 'express';
import Log4js from 'log4js';
import Crypto from '../crypto';
import Debug from '../debug';
import LoadDetection from '../load-detection';
import Logger, { LogFlags } from '../logger';
import * as Network from '../network';
import RateLimiting from '../rate-limiting';
import Reporter from '../reporter';
import * as ShardusTypes from '../shardus/shardus-types';
import StateManager from '../state-manager';
import Statistics from '../statistics';
import Storage from '../storage';
import MemoryReporting from '../utils/memoryReporting';
import NestedCounters from '../utils/nestedCounters';
import Profiler from '../utils/profiler';
declare type RouteHandlerRegister = (route: string, responseHandler: Handler) => void;
interface Shardus {
    io: SocketIO.Server;
    profiler: Profiler;
    nestedCounters: NestedCounters;
    memoryReporting: MemoryReporting;
    config: ShardusTypes.ShardusConfiguration;
    logger: Logger;
    mainLogger: Log4js.Logger;
    fatalLogger: Log4js.Logger;
    appLogger: Log4js.Logger;
    exitHandler: any;
    storage: Storage;
    crypto: Crypto;
    network: Network.NetworkClass;
    p2p: any;
    debug: Debug;
    appProvided: boolean;
    app: ShardusTypes.App;
    reporter: Reporter;
    stateManager: StateManager;
    statistics: Statistics;
    loadDetection: LoadDetection;
    rateLimiting: RateLimiting;
    heartbeatInterval: number;
    heartbeatTimer: NodeJS.Timeout;
    registerExternalGet: RouteHandlerRegister;
    registerExternalPost: RouteHandlerRegister;
    registerExternalPut: RouteHandlerRegister;
    registerExternalDelete: RouteHandlerRegister;
    registerExternalPatch: RouteHandlerRegister;
    _listeners: any;
    appliedConfigChanges: Set<number>;
}
/**
 * The main module that is used by the app developer to interact with the shardus api
 */
declare class Shardus extends EventEmitter {
    constructor({ server: config, logs: logsConfig, storage: storageConfig, }: {
        server: ShardusTypes.ShardusConfiguration;
        logs: ShardusTypes.LogsConfiguration;
        storage: ShardusTypes.StorageConfiguration;
    });
    /**
     * This function is what the app developer uses to setup all the SDK functions used by shardus
     * @typedef {import('./index').App} App
     */
    setup(app: ShardusTypes.App): this;
    /**
     * Calling this function will start the network
     * @param {*} exitProcOnFail Exit the process if an error occurs
     */
    start(): Promise<void>;
    /**
     * Function used to register event listeners
     * @param {*} emitter Socket emitter to be called
     * @param {*} event Event name to be registered
     * @param {*} callback Callback function to be executed on event
     */
    _registerListener(emitter: any, event: any, callback: any): void;
    /**
     * Function used to register event listeners
     * @param {*} event Name of the event to be unregistered
     */
    _unregisterListener(event: any): void;
    /**
     * Function to unregister all event listeners
     */
    _cleanupListeners(): void;
    /**
     * Function used to register listeners for transaction related events
     */
    _attemptCreateAppliedListener(): void;
    /**
     * Function to unregister all transaction related events
     */
    _attemptRemoveAppliedListener(): void;
    /**
     * function to unregister listener for the "accepted" event
     */
    _unlinkStateManager(): void;
    /**
     * Creates an instance of the StateManager module and registers the "accepted" event listener for queueing transactions
     */
    _createAndLinkStateManager(): void;
    /**
     * Function used to allow shardus to sync data specific to an app if it should be required
     */
    syncAppData(): Promise<void>;
    /**
     * Calls the "put" function with the "set" boolean parameter set to true
     * @param {*} tx The transaction data
     */
    set(tx: any): {
        success: boolean;
        reason: string;
    };
    /**
     * Allows the application to log specific data to an app.log file
     * @param  {...any} data The data to be logged in app.log file
     */
    log(...data: any[]): void;
    /**
     * Gets log flags.
     * use these for to cull out slow log lines with stringify
     * if you pass comma separated objects to dapp.log you do not need this.
     * Also good for controlling console logging
     */
    getLogFlags(): LogFlags;
    /**
     * Submits a transaction to the network
     * Returns an object that tells whether a tx was successful or not and the reason why via the
     * validateTxnFields application SDK function.
     * Throws an error if an application was not provided to shardus.
     *
     * {
     *   success: boolean,
     *   reason: string
     * }
     *
     */
    put(tx: ShardusTypes.OpaqueTransaction, set?: boolean, global?: boolean): {
        success: boolean;
        reason: string;
    };
    /**
     * Returns the nodeId for this node
     */
    getNodeId(): any;
    /**
     * Returns node info given a node id
     * @param {*} id The nodeId of this node
     */
    getNode(id: any): any;
    /**
     * Returns an array of cycles in the cycleChain history starting from the current cycle
     * @param {*} amount The number cycles to fetch from the recent cycle history
     */
    getLatestCycles(amount?: number): any;
    getCycleMarker(): any;
    /**
     * @typedef {import('../shardus/index.js').Node} Node
     */
    /**
     * getClosestNodes finds the closes nodes to a certain hash value
     * @param {string} hash any hash address (256bit 64 characters)
     * @param {number} count how many nodes to return
     * @returns {string[]} returns a list of nodes ids that are closest. roughly in order of closeness
     */
    getClosestNodes(hash: any, count?: number): string[];
    getClosestNodesGlobal(hash: any, count: any): string[];
    /**
     * isNodeInDistance
     * @param {string} hash any hash address (256bit 64 characters)
     * @param {string} nodeId id of a node
     * @param {number} distance how far away can this node be to the home node of the hash
     * @returns {boolean} is the node in the distance to the target
     */
    isNodeInDistance(hash: string, nodeId: string, distance: number): boolean;
    createApplyResponse(txId: any, txTimestamp: any): {
        stateTableResults: any[];
        txId: any;
        txTimestamp: any;
        accountData: any[];
        accountWrites: any[];
        appDefinedData: {};
    };
    applyResponseAddState(resultObject: any, accountData: any, localCache: any, accountId: any, txId: any, txTimestamp: any, stateBefore: any, stateAfter: any, accountCreated: any): void;
    applyResponseAddChangedAccount(resultObject: any, accountId: any, account: any, txId: any, txTimestamp: any): void;
    resetAppRelatedState(): Promise<void>;
    getLocalOrRemoteAccount(address: any): Promise<ShardusTypes.WrappedDataFromQueue>;
    /**
     * This function is used to query data from an account that is guaranteed to be in a remote shard
     * @param {*} address The address / publicKey of the account in which to query
     */
    getRemoteAccount(address: any): Promise<any>;
    /**
     * Creates a wrapped response for formatting required by shardus
     * @param {*} accountId
     * @param {*} accountCreated
     * @param {*} hash
     * @param {*} timestamp
     * @param {*} fullData
     */
    createWrappedResponse(accountId: any, accountCreated: any, hash: any, timestamp: any, fullData: any): {
        accountId: any;
        accountCreated: any;
        isPartial: boolean;
        stateId: any;
        timestamp: any;
        data: any;
    };
    /**
     * setPartialData
     * @param {Shardus.WrappedResponse} response
     * @param {any} partialData
     * @param {any} userTag
     */
    setPartialData(response: any, partialData: any, userTag: any): void;
    genericApplyPartialUpate(fullObject: any, updatedPartialObject: any): void;
    /**
     * Checks if this node is active in the network
     */
    isActive(): any;
    /**
     * Shutdown this node in the network
     * @param {boolean} exitProcess Exit the process when shutting down
     */
    shutdown(exitProcess?: boolean): Promise<void>;
    /**
     * Grab the SDK interface provided by the application for shardus
     * @param {App} application
     * @returns {App}
     */
    _getApplicationInterface(application: any): any;
    /**
     * Register the exit and config routes
     */
    _registerRoutes(): void;
    /**
     * Registers exception handlers for "uncaughtException" and "unhandledRejection"
     */
    registerExceptionHandler(): void;
    /**
     * Records a timestamp in a heartbeat to the storage module
     */
    _writeHeartbeat(): Promise<void>;
    /**
     * Sets up the heartbeat interval for keeping track of time alive
     */
    _setupHeartbeat(): void;
    /**
     * Stops the heartbeat interval
     */
    _stopHeartbeat(): void;
    /**
     * Checks a transaction timestamp for expiration
     * @param {number} timestamp
     */
    _isTransactionTimestampExpired(timestamp: any): boolean;
    updateConfigChangeQueue(lastCycle: ShardusTypes.Cycle): Promise<void>;
    patchObject(existingObject: any, changeObj: any): void;
    /**
     * Do some periodic debug logic work
     * @param lastCycle
     */
    updateDebug(lastCycle: ShardusTypes.Cycle): void;
    setGlobal(address: any, value: any, when: any, source: any): void;
    shardus_fatal(key: any, log: any, log2?: any): void;
    tryInvolveAccount(txID: string, address: string, isRead: boolean): boolean;
}
export default Shardus;
export * as ShardusTypes from '../shardus/shardus-types';
