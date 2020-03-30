const mongoCollections = require("./mongoCollections");
const users = mongoCollections.users;
const ObjectID = require('mongodb').ObjectID

/*
    in: 
        id: ID! or String!
    ret:
        user = {
                _id: ID
                username: String!
                password: String!
                location: {
                    type: "Point"
                    coordinates: [Long_ , Lat]
                }
                email: String!
            }

*/
async function get(id) {
    if(id === undefined){
        throw 'input is empty (in user.get)';
    }
    if(id.constructor != ObjectID){
        if(ObjectID.isValid(id)){
            id = new ObjectID(id);
        }
        else{
            throw 'Id is invalid!(in user.get)'
        }
    }

    const usersCollections = await users();
    const target = await usersCollections.findOne({ _id: id });
    if(target == null) throw 'user not found'

    return target;
}

/*
    in: 
        email: String!
    ret:
        user = {
                _id: ID
                username: String!
                password: String!
                location: {
                    type: "Point"
                    coordinates: [Long_ , Lat]
                }
                email: String!
            }

*/
async function getbyemail(email , Lat , Long_) {
    console.log('get by email')
    const usersCollections = await users();
    const target = await usersCollections.findOne({ email: email });
    
    if(target == null) throw 'user email not found'

    return await updateuser(target._id , target.username , target.password , Lat , Long_ );
    // return target
}

/*
    in:
        username: String!
        password: String!
        Lat: Double!
        Long_: Double!
        email: String!
    ret:
        user = {
            _id: ID
            username: String!
            password: String!
            location: {
                type: "Point"
                coordinates: [Long_ , Lat]
            }
            email: String!
        }
*/
async function adduser(username, password, Lat, Long_, email) {
    if(username == undefined || password == undefined || Lat == undefined || Long_ == undefined || email == undefined) {
        throw "Input missing! (in user.addusers)"
    }

    const usersCollections = await users();

    let newuser = {
        username: username,
        password: password,
        location: {
            type: "Point",
            coordinates: [Long_ , Lat]
        },
        email: email
    }

    const inserted = await usersCollections.insertOne(newuser);
    if(inserted.insertedCount === 0) throw 'Insert fail! (in user.addusers)';

    return await get(inserted.insertedId);
}


/*
    in:
        _id: ID! or String!
        username: String
        password: String
        Lat: Double
        Long_: Double
    ret:
        user = {
            _id: ID!
            username: String!
            password: String!
            location: {
                type: "Point"
                coordinates: [Long_ , Lat]
            }
            email: String!
        }
*/
async function updateuser(_id , username , password , Lat , Long_) {
    console.log('updateuser')
    if(_id === undefined){
        throw 'input is empty (in user.get)';
    }
    if(_id.constructor != ObjectID){
        if(ObjectID.isValid(_id)){
            _id = new ObjectID(_id);
        }
        else{
            throw 'Id is invalid!(in user.updateuser)'
        }
    }
    
    let target = await get(_id);
    console.log("in updateuser")
    // console.log(target);

    const usersCollections = await users();

    if(username == undefined) username = target.username;
    if(password == undefined) password = target.password;
    if(Lat == undefined) Lat = target.location.coordinates[1];
    if(Long_ == undefined) Long_ = target.location.coordinates[0];

    let updateuser = {
        $set: {
            _id: target._id,
            username: username,
            password: password,
            location: {
                type: "Point",
                coordinates: [Long_ , Lat]
            },
            email: target.email
        }
    }
    console.log('bf updateuser')
    const updated = await usersCollections.updateOne({ _id: _id } , updateuser);
    console.log('af updateuser,',updated.modifiedCount)
    // if(updated.modifiedCount === 0) throw 'Update fail! (in user.updateuser)';
    console.log('updateuser done')
    return await get(_id);
}

/*
    in:
        km: Double
        myLat: Double
        myLong: Double
    ret:
        All match users = {
            ...
            ...
            ...
        }
*/
async function UsersNearMeByKM(km, myLat, myLong) {
    if (isNaN(km) || isNaN(myLat) || isNaN(myLong)) throw 'Input data type must be a integer';
    if (km > 10000) throw 'Input number is too large (must be in range 1-10000)';

    const usersCollections = await users();
    
    usersCollections.createIndex({ "location": "2dsphere" });

    let aggr_users_near_me = await usersCollections.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [myLong, myLat]
                },
                distanceField: "dist.distant",
                maxDistance: km * 1000,
                spherical: true,
                distanceMultiplier: 0.001
            }
        }
    ]).toArray();

    if (aggr_users_near_me) return aggr_users_near_me;
    else throw 'Users data aggregation fail';
}


module.exports = {
    get,
    getbyemail,
    adduser,
    updateuser,
    UsersNearMeByKM
};