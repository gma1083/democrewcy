const database = require('../noomman/database');
const InstanceState = require('../noomman/InstanceState');
const Instance = require('../noomman/Instance');
const InstanceSet = require('../noomman/InstanceSet');
const InstanceSetReference = require('../noomman/InstanceSetReference');
const TestClassModels = require('./helpers/TestClassModels');
const TestingFunctions = require('./helpers/TestingFunctions');
const DatabaseConnection = require('./helpers/DatabaseConnection');
const testForError = TestingFunctions.testForError;
const arraysEqual = TestingFunctions.arraysEqual;
const objectsEqual = TestingFunctions.objectsEqual;

const TreeClass = TestClassModels.TreeClass;

describe('InstanceSetReference Tests', () => {

    describe('InstanceSetReference.constructor()', () => {

        it('Constructor sets ids to empty array and instanceSet to null.', () => {
            const instanceSetReference = new InstanceSetReference();

            if (Object.keys(instanceSetReference).length != 2) {
                throw new Error('Wrong number of properties.');
            }

            if (instanceSetReference.instanceSet !== null) {
                throw new Error('instanceSetReference.instanceSet not set to null.');
            }

            if (!Array.isArray(instanceSetReference._ids) || instanceSetReference._ids.length !== 0) {
                throw new Error('instanceSetReference._ids is not an empty array.');
            }
        });

        describe('Get Trap', () => {

            it('Getting the "ids" property returns an array of string ids.', () => {
                const instanceSetReference = new InstanceSetReference();

                instanceSetReference._ids = [database.ObjectId(), database.ObjectId()];

                if (!Array.isArray(instanceSetReference.ids) || instanceSetReference.ids.length !== 2) {
                    throw new Error('instanceSetReference.ids is not an array or of proper length.');
                }

                for (const id of instanceSetReference.ids) {
                    if (typeof(id) !== 'string') {
                        throw new Error('instanceSetReference.ids contains something other than strings.');
                    }
                }
            });

        });

    });

    describe('InstanceSetReference.sync()', () => {

        it('If instanceSetReference has no instanceSet, then no change to _ids.', () => {
            const instanceSetReference = new InstanceSetReference();

            instanceSetReference._ids = [database.ObjectId(), database.ObjectId()];

            instanceSetReference.sync();

            if (!Array.isArray(instanceSetReference._ids) || instanceSetReference._ids.length !== 2) {
                throw new Error('instanceSetReference._ids modified when it should not have been.');
            }
        });

        it('If instanceSetReference has instanceSet, then _ids match _ids in InstanceSet.', () => {   
            const instanceSetReference = new InstanceSetReference();
            const instanceSet = new InstanceSet(TreeClass, [
                new Instance(TreeClass),
                new Instance(TreeClass),
                new Instance(TreeClass),
            ]);

            instanceSetReference._ids = [database.ObjectId(), database.ObjectId()];
            instanceSetReference.instanceSet = instanceSet;

            instanceSetReference.sync();

            if (!arraysEqual(instanceSet.getObjectIds(), instanceSetReference._ids)) {
                throw new Error('instanceSetReference._ids not synced properly.');
            }
        });

    });

    describe('InstanceSetReference.equals()', () => {

        before(async () => {
            await DatabaseConnection.connect();
            await TreeClass.clear();
        });

        after(async () => {
            await DatabaseConnection.close();
        });
        
        it('InstanceSetReferences are equal if they contain exactly the same _ids.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [
                database.ObjectId(),
                database.ObjectId(),
                database.ObjectId(),
            ];

            instanceSetReference1._ids = _ids;
            instanceSetReference2._ids = _ids;

            if (!instanceSetReference1.equals(instanceSetReference2) || !instanceSetReference2.equals(instanceSetReference1)) {
                throw new Error('InstanceSetReferences are not equal when they should be.');
            }
        });
        
        it('InstanceSetReferences are equal if they contain exactly the same _ids regardless of order.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [
                database.ObjectId(),
                database.ObjectId(),
                database.ObjectId(),
            ];

            instanceSetReference1._ids = _ids;
            instanceSetReference2._ids = [_ids[1], _ids[2], _ids[0]];

            if (!instanceSetReference1.equals(instanceSetReference2) || !instanceSetReference2.equals(instanceSetReference1)) {
                throw new Error('InstanceSetReferences are not equal when they should be.');
            }
        });

        
        it('InstanceSetReferences are equal if they contain exactly the same _ids but different id objects.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids1 = [
                database.ObjectId(),
                database.ObjectId(),
                database.ObjectId(),
            ];
            const _ids2 = [
                database.ObjectId(_ids1[0].toHexString()),
                database.ObjectId(_ids1[1].toHexString()),
                database.ObjectId(_ids1[2].toHexString()),
            ];

            instanceSetReference1._ids = _ids1;
            instanceSetReference2._ids = _ids2;

            if (!instanceSetReference1.equals(instanceSetReference2) || !instanceSetReference2.equals(instanceSetReference1)) {
                throw new Error('InstanceSetReferences are not equal when they should be.');
            }
        });

        
        it('InstanceSetReferences are equal if they contain the same _ids, one from _ids and one from instanceSet.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const instanceSet = new InstanceSet(TreeClass, [
                new Instance(TreeClass),
                new Instance(TreeClass),
                new Instance(TreeClass),
            ]);

            instanceSetReference1._ids = instanceSet.getObjectIds();
            instanceSetReference2.instanceSet = instanceSet;

            if (!instanceSetReference1.equals(instanceSetReference2) || !instanceSetReference2.equals(instanceSetReference1)) {
                throw new Error('InstanceSetReferences are not equal when they should be.');
            }
        });

        
        it('InstanceSetReferences are equal if they contain exactly the same _ids from instanceSet, but different instance objects.', async () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const instanceSet1 = new InstanceSet(TreeClass, [
                new Instance(TreeClass),
                new Instance(TreeClass),
                new Instance(TreeClass),
            ]);

            await instanceSet1.save();

            const instanceSet2 = await TreeClass.find({ _id : { $in : instanceSet1.getObjectIds()}});

            instanceSetReference1.instanceSet = instanceSet1;
            instanceSetReference2.instanceSet = instanceSet2;

            if (!instanceSetReference1.equals(instanceSetReference2) || !instanceSetReference2.equals(instanceSetReference1)) {
                throw new Error('InstanceSetReferences are not equal when they should be.');
            }

        });

    });

    describe('InstanceSetReference.isEmpty()', () => {

        it('instanceSetReference with no _ids or instanceSet is empty.', () => {
            const instanceSetReference = new InstanceSetReference();

            if (!instanceSetReference.isEmpty()) {
                throw new Error('instanceSetReference is not empty when it should be.');
            }
        });

        it('instanceSet with no _ids and an empty instanceSet is empty.', () => {
            const instanceSetReference = new InstanceSetReference();
            instanceSetReference.instanceSet = new InstanceSet(TreeClass);

            if (!instanceSetReference.isEmpty()) {
                throw new Error('instanceSetReference is not empty when it should be.');
            }
        });

        it('instanceSet with _ids and an empty instanceSet is empty.', () => {
            const instanceSetReference = new InstanceSetReference();
            instanceSetReference.instanceSet = new InstanceSet(TreeClass);
            instanceSetReference._ids = [database.ObjectId()];

            if (!instanceSetReference.isEmpty()) {
                throw new Error('instanceSetReference is not empty when it should be.');
            }
        });

        it('instanceSet with _ids and no instanceSet is not empty.', () => {
            const instanceSetReference = new InstanceSetReference();
            instanceSetReference._ids = [database.ObjectId()];

            if (instanceSetReference.isEmpty()) {
                throw new Error('instanceSetReference is empty when it not should be.');
            }
        });

        it('instanceSet with no _ids and a non-empty instanceSet is not empty.', () => {
            const instanceSetReference = new InstanceSetReference();
            instanceSetReference.instanceSet = new InstanceSet(TreeClass, [new Instance(TreeClass)]);

            if (instanceSetReference.isEmpty()) {
                throw new Error('instanceSetReference is empty when it not should be.');
            }
        });

        it('instanceSet with _ids and a non-empty instanceSet is not empty.', () => {
            const instanceSetReference = new InstanceSetReference();
            instanceSetReference._ids = [database.ObjectId()];
            instanceSetReference.instanceSet = new InstanceSet(TreeClass, [new Instance(TreeClass)]);

            if (instanceSetReference.isEmpty()) {
                throw new Error('instanceSetReference is empty when it not should be.');
            }
        });

    });

    describe('InstanceSetReference.diff()', () => {

        it('If argument is null, and instanceSetReference is empty, then diff is empty object.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            
            const diff = instanceSetReference1.diff(null);

            if (Object.keys(diff).length !== 0) {
                throw new Error('Diff object is not empty and should be.');
            }
        });

        it('If argument is null, and instanceSetReference has _ids, diff has $set equal to _ids.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            
            instanceSetReference1._ids = [database.ObjectId(), database.ObjectId()];
            
            const diff = instanceSetReference1.diff(null);

            if (!arraysEqual(diff.$set, instanceSetReference1._ids)) {
                throw new Error('Diff is not as expected.');
            }
        });

        it('If instanceSetReferences are equal, then diff is empty object.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference1._ids = _ids;
            instanceSetReference2._ids = _ids;
            
            const diff = instanceSetReference1.diff(instanceSetReference2);

            if (Object.keys(diff).length !== 0) {
                throw new Error('Diff object is not empty and should be.');
            }
        });

        it('If instanceSetReference has _ids, but argument is empty isntanceSetReference, diff has $set equal to _ids.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference1._ids = _ids;
            
            const diff = instanceSetReference1.diff(instanceSetReference2);

            if (!arraysEqual(diff.$set, instanceSetReference1._ids)) {
                throw new Error('Diff is not as expected.');
            }
        });

        it('If instanceSetReference is empty, and argument has _ids, diff has $unset equal to arguments _ids.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference2._ids = _ids;
            
            const diff = instanceSetReference1.diff(instanceSetReference2);

            if (!arraysEqual(diff.$unset, instanceSetReference2._ids)) {
                throw new Error('Diff is not as expected.');
            }

        });

        it('If instanceSetReference contains all _ids as argument _ids, plus additional, diff has $addToSet.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            const additionalIds = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference1._ids = [..._ids, ...additionalIds];
            instanceSetReference2._ids = _ids;
            
            const diff = instanceSetReference1.diff(instanceSetReference2);

            if (!arraysEqual(diff.$addToSet, additionalIds)) {
                throw new Error('Diff is not as expected.');
            }
        });

        it('If argument _ids contains all instanceSetReference _ids, plus additional, diff has $pull.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            const additionalIds = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference2._ids = [..._ids, ...additionalIds];
            instanceSetReference1._ids = _ids;
            
            const diff = instanceSetReference1.diff(instanceSetReference2);

            if (!arraysEqual(diff.$pull, additionalIds)) {
                throw new Error('Diff is not as expected.');
            }
        });

        it('If argument _ids and instanceSetReference _ids are not supersets one way or another, diff has $set equal to _ids.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const overlappingIds = [database.ObjectId(), database.ObjectId()];
            const _ids1 = [database.ObjectId(), database.ObjectId()];
            const _ids2 = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference1._ids = [..._ids1, ...overlappingIds];
            instanceSetReference2._ids = [..._ids2, ...overlappingIds];
            
            const diff = instanceSetReference1.diff(instanceSetReference2);

            if (!arraysEqual(diff.$set, instanceSetReference1._ids)) {
                throw new Error('Diff is not as expected.');
            }
        });
        
        describe('Diff When Ids Are Different Objects', () => {

            it('If instanceSetReference contains all _ids as argument _ids, plus additional, diff has $addToSet.', () => {
                const instanceSetReference1 = new InstanceSetReference();
                const instanceSetReference2 = new InstanceSetReference();
                const ids = [database.ObjectId().toHexString(), database.ObjectId().toHexString()];
                const additionalIds = [database.ObjectId(), database.ObjectId()];
                
                instanceSetReference1._ids = [...(ids.map(id => database.ObjectId(id))), ...additionalIds];
                instanceSetReference2._ids = ids.map(id => database.ObjectId(id));
                
                const diff = instanceSetReference1.diff(instanceSetReference2);

                if (!diff.$addToSet || !arraysEqual(diff.$addToSet, additionalIds)) {
                    throw new Error('Diff is not as expected.');
                }
            });
    
            it('If argument _ids contains all instanceSetReference _ids, plus additional, diff has $pull.', () => {
                const instanceSetReference1 = new InstanceSetReference();
                const instanceSetReference2 = new InstanceSetReference();
                const ids = [database.ObjectId().toHexString(), database.ObjectId().toHexString()];
                const additionalIds = [database.ObjectId(), database.ObjectId()];
                
                instanceSetReference1._ids = ids.map(id => database.ObjectId(id));
                instanceSetReference2._ids = [...(ids.map(id => database.ObjectId(id))), ...additionalIds];
                
                const diff = instanceSetReference1.diff(instanceSetReference2);
    
                if (!diff.$pull || !arraysEqual(diff.$pull, additionalIds)) {
                    throw new Error('Diff is not as expected.');
                }
            });
    
            it('If argument _ids and instanceSetReference _ids are not supersets one way or another, diff has $set equal to _ids.', () => {
                const instanceSetReference1 = new InstanceSetReference();
                const instanceSetReference2 = new InstanceSetReference();
                const overlappingIds = [database.ObjectId().toHexString(), database.ObjectId().toHexString()];
                const _ids1 = [database.ObjectId(), database.ObjectId()];
                const _ids2 = [database.ObjectId(), database.ObjectId()];
                
                instanceSetReference1._ids = [..._ids1, ...overlappingIds.map(id => database.ObjectId(id))];
                instanceSetReference2._ids = [..._ids2, ...overlappingIds.map(id => database.ObjectId(id))];
                
                const diff = instanceSetReference1.diff(instanceSetReference2);
    
                if (!diff.$set || !arraysEqual(diff.$set, instanceSetReference1._ids)) {
                    throw new Error('Diff is not as expected.');
                }
            });

        });

    });

    describe('InstanceSetReference.splitDiff()', () => {

        it('If argument is null, and instanceSetReference is empty, then diff is empty object.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            
            const diff = instanceSetReference1.splitDiff(null);

            if (Object.keys(diff).length !== 0) {
                throw new Error('Diff object is not empty and should be.');
            }
        });

        it('If argument is null, and instanceSetReference has _ids, diff has $set equal to _ids.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            
            instanceSetReference1._ids = [database.ObjectId(), database.ObjectId()];
            
            const diff = instanceSetReference1.splitDiff(null);

            if (!arraysEqual(diff.$set, instanceSetReference1._ids)) {
                throw new Error('Diff is not as expected.');
            }
        });

        it('If instanceSetReferences are equal, then diff is empty object.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference1._ids = _ids;
            instanceSetReference2._ids = _ids;
            
            const diff = instanceSetReference1.splitDiff(instanceSetReference2);

            if (Object.keys(diff).length !== 0) {
                throw new Error('Diff object is not empty and should be.');
            }
        });

        it('If instanceSetReference has _ids, but argument is empty isntanceSetReference, diff has $set equal to _ids.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference1._ids = _ids;
            
            const diff = instanceSetReference1.splitDiff(instanceSetReference2);

            if (!arraysEqual(diff.$set, instanceSetReference1._ids)) {
                throw new Error('Diff is not as expected.');
            }
        });

        it('If instanceSetReference is empty, and argument has _ids, diff has $unset equal to arguments _ids.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference2._ids = _ids;
            
            const diff = instanceSetReference1.splitDiff(instanceSetReference2);

            if (!arraysEqual(diff.$unset, instanceSetReference2._ids)) {
                throw new Error('Diff is not as expected.');
            }

        });

        it('If instanceSetReference contains all _ids as argument _ids, plus additional, diff has $addToSet.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            const additionalIds = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference1._ids = [..._ids, ...additionalIds];
            instanceSetReference2._ids = _ids;
            
            const diff = instanceSetReference1.splitDiff(instanceSetReference2);

            if (!arraysEqual(diff.$addToSet, additionalIds)) {
                throw new Error('Diff is not as expected.');
            }
        });

        it('If argument _ids contains all instanceSetReference _ids, plus additional, diff has $pull.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const _ids = [database.ObjectId(), database.ObjectId()];
            const additionalIds = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference2._ids = [..._ids, ...additionalIds];
            instanceSetReference1._ids = _ids;
            
            const diff = instanceSetReference1.splitDiff(instanceSetReference2);

            if (!arraysEqual(diff.$pull, additionalIds)) {
                throw new Error('Diff is not as expected.');
            }
        });
    
        it('If argument _ids and instanceSetReference _ids are not supersets one way or another, diff has $addToSet and $pull.', () => {
            const instanceSetReference1 = new InstanceSetReference();
            const instanceSetReference2 = new InstanceSetReference();
            const overlappingIds = [database.ObjectId(), database.ObjectId()];
            const _ids1 = [database.ObjectId(), database.ObjectId()];
            const _ids2 = [database.ObjectId(), database.ObjectId()];
            
            instanceSetReference1._ids = [..._ids1, ...overlappingIds];
            instanceSetReference2._ids = [..._ids2, ...overlappingIds];
            
            const diff = instanceSetReference1.splitDiff(instanceSetReference2);

            if (!diff.$addToSet || !arraysEqual(diff.$addToSet, _ids1)) {
                throw new Error('Diff is not as expected.');
            }

            if (!diff.$pull || !arraysEqual(diff.$pull, _ids2)) {
                throw new Error('Diff is not as expected.');
            }
        });
        
        describe('Diff When Ids Are Different Objects', () => {

            it('If instanceSetReference contains all _ids as argument _ids, plus additional, diff has $addToSet.', () => {
                const instanceSetReference1 = new InstanceSetReference();
                const instanceSetReference2 = new InstanceSetReference();
                const ids = [database.ObjectId().toHexString(), database.ObjectId().toHexString()];
                const additionalIds = [database.ObjectId(), database.ObjectId()];
                
                instanceSetReference1._ids = [...(ids.map(id => database.ObjectId(id))), ...additionalIds];
                instanceSetReference2._ids = ids.map(id => database.ObjectId(id));
                
                const diff = instanceSetReference1.splitDiff(instanceSetReference2);

                if (!diff.$addToSet || !arraysEqual(diff.$addToSet, additionalIds)) {
                    throw new Error('Diff is not as expected.');
                }
            });
    
            it('If argument _ids contains all instanceSetReference _ids, plus additional, diff has $pull.', () => {
                const instanceSetReference1 = new InstanceSetReference();
                const instanceSetReference2 = new InstanceSetReference();
                const ids = [database.ObjectId().toHexString(), database.ObjectId().toHexString()];
                const additionalIds = [database.ObjectId(), database.ObjectId()];
                
                instanceSetReference1._ids = ids.map(id => database.ObjectId(id));
                instanceSetReference2._ids = [...(ids.map(id => database.ObjectId(id))), ...additionalIds];
                
                const diff = instanceSetReference1.splitDiff(instanceSetReference2);
    
                if (!diff.$pull || !arraysEqual(diff.$pull, additionalIds)) {
                    throw new Error('Diff is not as expected.');
                }
            });
    
            it('If argument _ids and instanceSetReference _ids are not supersets one way or another, diff has $addToSet and $pull.', () => {
                const instanceSetReference1 = new InstanceSetReference();
                const instanceSetReference2 = new InstanceSetReference();
                const overlappingIds = [database.ObjectId().toHexString(), database.ObjectId().toHexString()];
                const _ids1 = [database.ObjectId(), database.ObjectId()];
                const _ids2 = [database.ObjectId(), database.ObjectId()];
                
                instanceSetReference1._ids = [..._ids1, ...overlappingIds.map(id => database.ObjectId(id))];
                instanceSetReference2._ids = [..._ids2, ...overlappingIds.map(id => database.ObjectId(id))];
                
                const diff = instanceSetReference1.splitDiff(instanceSetReference2);
    
                if (!diff.$addToSet || !arraysEqual(diff.$addToSet, _ids1)) {
                    throw new Error('Diff is not as expected.');
                }
    
                if (!diff.$pull || !arraysEqual(diff.$pull, _ids2)) {
                    throw new Error('Diff is not as expected.');
                }
            });

        });

    });

});