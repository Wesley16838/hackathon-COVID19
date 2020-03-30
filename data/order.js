const mongoCollections = require("./mongoCollections");
const user_ = require('./user');
const orders = mongoCollections.orders;
const ObjectID = require('mongodb').ObjectID

/*
    in: 
        id: ID!
    ret:
        order = {
                _id: ID!
                user: user
                prod: String!
                amt: Integer!
                wish: String!
                wish_amt: Integer!
                status: Factor("Open" , "Pending" , "Closed")!
                reserved_by: user
                last_updated: UTC String!
                description: String!
                img: String!
            }

*/
async function get(id) {
    if(id === undefined){
        throw 'input is empty (in order.get)';
    }
    if(id.constructor != ObjectID){
        if(ObjectID.isValid(id)){
            id = new ObjectID(id);
        }
        else{
            throw 'Id is invalid!(in order.get)'
        }
    }

    const ordersCollections = await orders();
    const target = await ordersCollections.findOne({ _id: id });
    if(target == null) throw 'order not found'

    target['user'] = await user_.get(target.user_id);
    delete target.user_id;
    if(target.reserved_by != null) {
        target['reserved_by_user'] = await user_.get(target.reserved_by);
        delete target.reserved_by;
    }

    return target;
}

/*
    in: 
        uid: String!
    ret:
        order[] = [{
                _id: ID!
                user: user!
                prod: String!
                amt: Integer!
                wish: String!
                wish_amt: Integer!
                status: Factor("Open" , "Pending" , "Closed")!
                reserved_by: user
                last_updated: UTC String!
                description: String!
                img: String!
            }]

*/
async function getbyuser(uid) {
    if(uid == undefined) {
        throw "user id is empty! (in order.getbyuser)"
    }
    if(uid.constructor != ObjectID){
        if(ObjectID.isValid(uid)){
            uid = new ObjectID(uid);
        }
        else{
            throw 'User Id is invalid!(in order.getbyuserid)'
        }
    }

    const ordersCollections = await orders();
    const targets = await ordersCollections.find({ user_id: uid }).toArray();
    for(x in targets) {
        targets[x]['user'] = await user_.get(targets[x].user_id);
        delete targets[x].user_id;
        // console.log(target);
        if(targets[x].reserved_by != null) {
            targets[x]['reserved_by_user'] = await user_.get(targets[x].reserved_by);
            delete targets[x].reserved_by;
        }
    }
    targets.sort(datecompare);
    return targets;
}

async function getpendingbyuser(uid) {
    if(uid == undefined) {
        throw "user id is empty! (in order.getbyuser)"
    }
    if(uid.constructor != ObjectID){
        if(ObjectID.isValid(uid)){
            uid = new ObjectID(uid);
        }
        else{
            throw 'User Id is invalid!(in order.getbyuserid)'
        }
    }

    const ordersCollections = await orders();
    const bought = await ordersCollections.find({ reserved_by: uid , status: "Pending" }).toArray();
    const sold = await ordersCollections.find({ user_id: uid , status: "Pending" }).toArray();
    let out = new Array(0);
    for(x in bought) {
        bought[x]['user'] = await user_.get(bought[x].user_id);
        delete bought[x].user_id;
        // console.log(target);
        if(bought[x].reserved_by != null) {
            bought[x]['reserved_by_user'] = await user_.get(bought[x].reserved_by);
            delete bought[x].reserved_by;
        }
        bought[x]['role']='buyer';
        out.push(bought[x]);
    }

    for(x in sold) {
        sold[x]['user'] = await user_.get(sold[x].user_id);
        delete sold[x].user_id;
        // console.log(target);
        if(sold[x].reserved_by != null) {
            sold[x]['reserved_by_user'] = await user_.get(sold[x].reserved_by);
            delete sold[x].reserved_by;
        }
        sold[x]['role']='seller';
        out.push(sold[x]);
    }
    out.sort(datecompare);
    return out;
}

async function getcompletebyuser(uid) {
    if(uid == undefined) {
        throw "user id is empty! (in order.getbyuser)"
    }
    if(uid.constructor != ObjectID){
        if(ObjectID.isValid(uid)){
            uid = new ObjectID(uid);
        }
        else{
            throw 'User Id is invalid!(in order.getbyuserid)'
        }
    }

    const ordersCollections = await orders();
    const bought = await ordersCollections.find({ reserved_by: uid , status: "Completed" }).toArray();
    const sold = await ordersCollections.find({ user_id: uid , status: "Completed" }).toArray();
    let out = new Array(0);
    for(x in bought) {
        bought[x]['user'] = await user_.get(bought[x].user_id);
        delete bought[x].user_id;
        // console.log(target);
        if(bought[x].reserved_by != null) {
            bought[x]['reserved_by_user'] = await user_.get(bought[x].reserved_by);
            delete bought[x].reserved_by;
        }
        bought[x]['role']='buyer';
        out.push(bought[x]);
    }

    for(x in sold) {
        sold[x]['user'] = await user_.get(sold[x].user_id);
        delete sold[x].user_id;
        // console.log(target);
        if(sold[x].reserved_by != null) {
            sold[x]['reserved_by_user'] = await user_.get(sold[x].reserved_by);
            delete sold[x].reserved_by;
        }
        sold[x]['role']='seller';
        out.push(sold[x]);
    }
    out.sort(datecompare);
    return out;
}

/*
    in:
        query: {
            prod: String
            wish: String
        }
    ret:
        order[] = [{
                _id: ID!
                user: user!
                prod: String!
                amt: Integer!
                wish: String!
                wish_amt: Integer!
                status: Factor("Open" , "Pending" , "Closed")!
                reserved_by: user
                last_updated: UTC String
                description: String
                img: String
            }]

*/
async function getAll(query) {
    const ordersCollections = await orders();
    let targets = await ordersCollections.find({status: "Open"}).toArray();
    let arr = new Array(0);
    if(query.prod != undefined) {
        for(var x = 0 ; x < targets.length ; x++) {
            if(contains(targets[x].prod , query.prod)) {
                arr.push(targets[x]);
            }
        }
        targets = arr;
    }
    let arr2 = new Array(0);
    if(query.wish != undefined) {
        for(var x = 0 ; x < targets.length ; x++) {
            if(contains(targets[x].wish , query.wish)) {
                arr2.push(targets[x]);
            }
        }
        targets = arr2;
    }
    
    for(x in targets) {
        targets[x]['user'] = await user_.get(targets[x].user_id);
        delete targets[x].user_id;
        if(targets[x].reserved_by != null) {
            targets[x]['reserved_by_user'] = await user_.get(targets[x].reserved_by);
            delete targets[x].reserved_by;
        }
    }
    // console.log(targets);

    targets.sort(datecompare);
    return targets;
}

/*
    in:
        user_id: String!
        prod: String!
        amt: Integer!
        wish: String!
        wish_amt: Integer!
        description: String!
        img: String!
    ret:
        order = {
            _id: ID!
            user: user!
            prod: String!
            amt: Integer!
            wish: String!
            wish_amt: Integer!
            status: Factor("Open" , "Pending" , "Closed")!
            reserved_by: user
            last_updated: UTC String
            description: String
            img: String
        }
*/
async function addorders(user_id , prod , amt , wish , wish_amt , description , img) {
    if(user_id == undefined || prod == undefined || amt == undefined || wish == undefined || wish_amt == undefined || description == undefined) {
        throw "Input missing! (in order.addorders)"
    }

    user_id = new ObjectID(user_id);

    const ordersCollections = await orders();
    let d = new Date();
    let neworder = {
        user_id: user_id,
        prod: prod,
        amt: amt,
        wish: wish,
        wish_amt: wish_amt,
        status: "Open",
        reserved_by: null,
        last_updated: d.toUTCString(),
        description: description,
        img: img
    }

    const inserted = await ordersCollections.insertOne(neworder);
    if(inserted.insertedCount === 0) throw 'Insert fail! (in order.addorders)';

    return await get(inserted.insertedId);
}


/*
    in:
        post_id: ID! or String!
        prod: String
        amt: Integer
        wish: String
        wish_amt: Integer
        status: Factor("Open" , "Pending" , "Closed")
        reserved_by: String
        description: String
    ret:
        order = {
            _id: ID!
            user: user!
            prod: String!
            amt: Integer!
            wish: String!
            wish_amt: Integer!
            status: Factor("Open" , "Pending" , "Closed")!
            reserved_by: user
            last_updated: UTC String
            description: String
            img: String
        }
*/
async function updateorders(post_id , prod , amt , wish , wish_amt, status , reserved_by , description , img){
    if(post_id == undefined) { throw 'input is empty (in user.get)'; }
    if(post_id.constructor != ObjectID) {
        if(ObjectID.isValid(post_id)) post_id = new ObjectID(post_id);
        else throw 'Id is invalid!(in order.updateorder)';
    }

    let target = await get(post_id);

    const ordersCollections = await orders();
    if(prod == undefined) prod = target.prod;
    if(amt == undefined) amt = target.amt;
    if(wish == undefined) wish = target.wish;
    if(wish_amt == undefined) wish_amt = target.wish_amt;
    if(status == undefined) status = target.status;
    if(reserved_by === undefined) reserved_by = target.reserved_by_user._id;
    if(description == undefined) description = target.description;
    if(img == undefined) img = target.img

    let reservedTmp;
    if (reserved_by === null) reservedTmp = null;
    else reservedTmp = reserved_by.constructor == ObjectID ? reserved_by : new ObjectID(reserved_by);

    let d = new Date();

    let updatedorder = {
        $set: {
            prod: prod,
            amt: amt,
            wish: wish,
            wish_amt: wish_amt,
            status: status,
            reserved_by: reservedTmp,
            last_updated: d.toUTCString(),
            description: description,
            img: img
        }
    }

    const updated = await ordersCollections.updateOne({ _id: post_id } , updatedorder);
    if(updated.modifiedCount === 0) throw 'Update Fail! (updateorders())';

    return await get(post_id);
}

/* Support function */
function contains(s1 , s2) {
    if(s1.length < s2.length) return false;
    for(var x = 0 ; x <= s1.length - s2.length ; x++) {
        if(s1.charAt(x) == s2.charAt(0)) {
            var cnt = 0;
            for(var y = 0 ; y < s2.length ; y++) {
                if(s1.charAt(x+y) != s2.charAt(y)) break;
                cnt++;
            }
            if(cnt == s2.length) return true;
        }
    }
    return false;
}

function datecompare(a , b) {
    let d1 = new Date(a.last_updated);
    let d2 = new Date(b.last_updated);

    return d2-d1
}


/*
    in:
        userId: ID! or String!,
        orderId: ID! or String!
    ret:
        updated_order = {
            _id: ID!
            user: user!
            prod: String!
            amt: Integer!
            wish: String!
            wish_amt: Integer!
            status: Factor("Open" , "Pending" , "Closed")!
            reserved_by: user
            last_updated: UTC String
            description: String
            img: String
        }
*/
async function AssignOrderToUser(userId, orderId) {
    let user;
    let order;

    // Check if user / order exist in database
    try { user = await user_.get(userId); } catch(e) { throw e; }
    try { order = await get(orderId); } catch(e) { throw e; }

    // Can't buy things from yourself
    if (user._id.equals(order.user._id)) {
        let updatedOrder = { self_buy: true }
        return updatedOrder;
    }

    return await updateorders(order._id, undefined, undefined, undefined, undefined, "Pending", user._id, undefined, undefined);
}


async function SetOrderComplete(orderId) {
    let order;

    // Check if order exist in database
    try { order = await get(orderId); } catch(e) { throw e; }

    return await updateorders(order._id, undefined, undefined, undefined, undefined, "Completed", undefined, undefined, undefined);
}

async function SetOrderOpen(orderId) {
    let order;

    // Check if order exist in database
    try { order = await get(orderId); } catch(e) { throw e; }

    return await updateorders(order._id, undefined, undefined, undefined, undefined, "Open", null, undefined, undefined);
}



module.exports = {
    get,
    getbyuser,
    getpendingbyuser,
    getcompletebyuser,
    getAll,
    addorders,
    updateorders,
    AssignOrderToUser,
    SetOrderComplete,
    SetOrderOpen
};
