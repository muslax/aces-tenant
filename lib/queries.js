import { API } from "config/api";
import { DB } from "config/db";
import { connect } from "./database";

export async function getUsers(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { dba } = await connect();
    const rs = await dba.collection(DB.USERS).find(
      { lid: apiUser.license._id, deleted: false },
      { projection: {
        fullname: 1,
        username: 1,
        email: 1,
        // licenseOwner: 1,
        verified: 1,
        disabled: 1,
      }}
    ).toArray();

    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getLicense(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { dba } = await connect();
    const rs = await dba.collection(DB.LICENSES).findOne({ _id: apiUser.license._id });
    if (rs) return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

// https://stackoverflow.com/questions/44413668/mongodb-aggregation-limit-lookup
export async function getClients(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { dba } = await connect();
    const rs = await dba.collection(DB.CLIENTS).aggregate([
      { $match: { lid: apiUser.license._id }},
      { $lookup: {
        from: 'projects',
        // localField: '_id',
        // foreignField: 'cid',
        as: 'projects',
        let: { indicator_id: '$_id' },
        pipeline: [
          { $match: {
            $expr: { $eq: [ '$cid', '$$indicator_id' ] }
          } },
          { $sort: { _id: -1 }},
        //   // { $limit: 1 }
        ]
      }},
      { $project: {
        "lid": 1,
        "name": 1,
        "address": 1,
        "city": 1,
        "phone": 1,
        "contacts": 1,
        "createdBy": 1,
        "created": 1,
        'projects._id': 1,
        'projects.title': 1,
        'projects.status': 1,
        'projects.contractDate': 1,
        'projects.created': 1,
      }}
    ]).toArray()

    return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getProjects(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { dba } = await connect();
    // DB.PROJECTVIEW
    const rs = await dba.collection("VProjects2").find(
      { lid: apiUser.license._id },
      { projection: {
        batches: 0, // We don't need this in projects listing
      }}
    ).sort({ _id: -1 }).toArray();

    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getProject(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { pid } = req.query;
    const { dba } = await connect();
    // DB.PROJECTVIEW
    // const rs = await dba.collection("VProjects").findOne({
    //   _id: pid,
    //   lid: apiUser.license._id, // Always match with user's license
    // });
    const cursor = await dba.collection(DB.PROJECTS).aggregate([
      { $match: { _id: pid }},
      { $lookup: { from: "users", localField: "admin", foreignField: "username", as: "projectAdmin" } },
      { $lookup: { from: "clients", localField: "cid", foreignField: "_id", as: "client" } },
      // USING VBatches
      { $lookup: { from: 'VBatches', localField:'_id', foreignField: 'pid', as: 'batches' }},
      { $unwind: '$projectAdmin'},
      { $unwind: '$client'},
      { $project: {
        lid: 1,
        cid: 1,
        status: 1,
        batchMode: 1,
        title: 1,
        fullTitle: 1,
        description: 1,
        contractDate: 1,
        // admin: 1,
        'admin.username': '$projectAdmin.username',
        'admin.fullname': '$projectAdmin.fullname',
        "client._id": 1,
        "client.name": 1,
        "client.address": 1,
        "client.city": 1,
        batches: 1
      }}
    ]);

    const rs = await cursor.next();
    if (!rs) return res.status(404).json({ message: 'Not found' })
    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getBatches(req, res) {
  try {
    const { pid } = req.query;
    const { dba } = await connect();

    // const rs = await dba.collection(DB.BATCHES).find(
    //   { pid: pid }
    // ).sort({ _id: -1 }).toArray();
    const rs = await dba.collection(DB.BATCHES).aggregate([
      { $match: { pid: pid }},
      { $lookup: {
        from: DB.PERSONAE,
        localField: '_id',
        foreignField: 'bid',
        as: 'persons',
      }},
      { $project: {
        pid: 1,
        title: 1,
        token: 1,
        modules: 1,
        date1: 1,
        date2: 1,
        disabled: 1,
        creator: 1,
        personae: { $size: '$persons'}
      }}
    ]).sort({ _id: -1 }).toArray();

    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getBatchPersonae(req, res) {
  try {
    const { bid } = req.query;
    const { dba } = await connect();

    const rs = await dba.collection(DB.PERSONAE).find(
      { bid: bid }
    ).toArray();

    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getBatch(req, res) {
  try {
    const { bid } = req.query;
    const { dba } = await connect();

    // TODO: attach batch schedule info
    const cursor = await dba.collection(DB.BATCHES).aggregate([
      { $match: { _id: bid }},
      { $limit: 1 },
      { $lookup: {
        from: DB.PERSONAE,
        localField: '_id',
        foreignField: 'bid',
        as: 'personae',
      }},
      { $project: {
        pid: 1,
        name: 1,
        accessCode: 1,
        modules: 1,
        dateOpen: 1,
        dateClosed: 1,
        disabled: 1,
        createdBy: 1,
        created: 1,
        personae: { $size: '$personae' }
      }}
    ]);

    const rs = await cursor.next();
    if (!rs) return res.status(404).json({ message: 'Not found' })
    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export const QUERIES = {};

QUERIES[API.GET_USERS] = getUsers;
QUERIES[API.GET_LICENSE] = getLicense;
QUERIES[API.GET_CLIENTS] = getClients;
QUERIES[API.GET_PROJECTS] = getProjects;
QUERIES[API.GET_PROJECT] = getProject;
QUERIES[API.GET.BATCHES] = getBatches;
QUERIES[API.GET_BATCH] = getBatch;
QUERIES[API.GET.BATCH_PERSONAE] = getBatchPersonae;
