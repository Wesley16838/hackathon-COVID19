const mongoCollections = require("./mongoCollections");
const map = mongoCollections.map;
const map2 = mongoCollections.map2;
const vcase = mongoCollections.case;

async function VirusNearMeByKM(km, myLat, myLong) {
    if (isNaN(km) || isNaN(myLat) || isNaN(myLong)) throw 'Input data type must be a integer';
    if (km > 10000) throw 'Input number is too large (must be in range 1-10000)';

    const map2Collections = await map2();
    
    map2Collections.createIndex({ "location": "2dsphere" });

    let aggr_virus_near_me = await map2Collections.aggregate([
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

    if (aggr_virus_near_me) return aggr_virus_near_me;
    else throw 'Virus data aggregation fail';
}


async function TopNState(n) {
    if (isNaN(n)) throw 'Input data type must be an integer';
    if (n > 52) throw 'Input number is too large (must be in range 1-52)';

    const mapCollections = await map();

    let aggr_top_n_states = await mapCollections.aggregate([
        //{ $match: { TimeStamp: { $gte: from_date, $lte: to_date } } },
        {
            $group:
            {
                _id: "$State",
                //count: { $sum: 1 }
                total: { $sum: "$Confirmed" }
            }
        },
        {
            $sort:
            {
                total: -1
            }
        },
        {
            $limit: n
        }
    ]).toArray();

    if (aggr_top_n_states) return aggr_top_n_states;
    else throw 'Aggregate Top N States exec fail';
}

module.exports = {
    TopNState,
    VirusNearMeByKM
};