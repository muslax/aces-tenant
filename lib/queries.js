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

    const rs = await dba.collection(DB.VTENANTS).findOne(
      { "license._id": apiUser.license._id },
      { projection: {
        type: "$license.type",
        title: "$license.title",
        publishDate: "$license.publishDate",
        expiryDate: "$license.expiryDate",
        refreshDate: "$license.refreshDate",
        disabled: "$license.disabled",
        logoUrl: "$license.logoUrl",
        creator: "$license.creator",
        created: "$license.created",
        contact: {
          username: "$owner.username",
          fullname: "$owner.fullname",
          username: "$owner.username",
          email: "$owner.email",
          verified: "$owner.verified",
          disabled: "$owner.disabled",
          deleted: "$owner.deleted",
          gender: "$owner.gender",
          phone: "$owner.phone",
        },
      }}
    )

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

export async function getProject(req, res) {
  try {
    const apiUser = req.session.get("user");
    const lid = apiUser.license._id;
    const { pid } = req.query;
    const { dba } = await connect();

    // Must match licenseId
    const rs = await dba.collection(DB.VPROJECTS).findOne(
      { _id: pid, lid: lid }
    );

    if (!rs) return res.status(404).json({ message: 'Not found' });

    return res.json(rs);
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getProjects(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { batches } = req.query;
    console.log("Batches", batches == undefined)
    const { dba } = await connect();

    const rs = await dba.collection(DB.VPROJECTS).find(
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
        title: 1,
        token: 1,
        modules: 1,
        order: 1,
        timing: 1,
        date1: 1,
        date2: 1,
        disabled: 1,
        creator: 1,
        slot1: 1,
        slot2: 1,
        slot3: 1,
        slot4: 1,
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
      { $lookup: {
        from: DB.GROUPS,
        localField: '_id',
        foreignField: 'bid',
        as: 'groups',
      }},
      { $project: {
        pid: 1,
        title: 1,
        token: 1,
        modules: 1,
        order: 1,
        timing: 1,
        date1: 1,
        date2: 1,
        disabled: 1,
        protected: 1,
        creator: 1,
        slot1: 1,
        slot2: 1,
        slot3: 1,
        slot4: 1,
        personae: { $size: '$persons'},
        groups: { $size: '$groups'},
      }}
    ]).sort({ _id: -1 }).toArray();

    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

function createProjection(params) {
  const projection = {};
  params.forEach(f => { projection[f.trim()] = 1 });
  return projection;
}

export async function getBatchPersonae(req, res) {
  try {
    const { bid, fields } = req.query;
    const { dba } = await connect();

    let param = [];
    if (fields) param = fields.split(',');

    const rs = await dba.collection(DB.PERSONAE).find(
      { bid: bid },
      { projection: createProjection(param)}
    ).toArray();

    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getBatchGroups(req, res) {
  try {
    const { bid } = req.query;
    const { dba } = await connect();


    const rs = await dba.collection(DB.GROUPS).find({ bid: bid }).toArray();

    return res.json(rs)
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getModules(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { dba } = await connect();
    const rs = await dba.collection(DB.MODULES).find(
      {},
      { projection: {
        items: 0, conditions:0, seeds: 0, tables: 0, articles: 0
      }}
    ).toArray();

    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export async function getPersonae(req, res) {
  try {
    const apiUser = req.session.get("user");
    const { bid } = req.body;
    const { dba } = await connect();
    const rs = await dba.collection(DB.PERSONAE).find({ bid: bid }).toArray();

    return res.json( rs );
  } catch (error) {
    return res.status(error.status || 500).end(error.message)
  }
}

export const QUERIES = {};


QUERIES[API.GET.PROJECTS] = getProjects;
QUERIES[API.GET.PROJECT] = getProject;
QUERIES[API.GET.CLIENTS] = getClients;
QUERIES[API.GET.LICENSE] = getLicense;
QUERIES[API.GET.USERS] = getUsers;
QUERIES[API.GET.BATCH] = getBatch;
QUERIES[API.GET.BATCHES] = getBatches;
QUERIES[API.GET.MODULES] = getModules;
QUERIES[API.GET.BATCH_PERSONAE] = getBatchPersonae;
QUERIES[API.GET.PERSONAE] = getPersonae;
QUERIES[API.GET.BATCH_GROUPS] = getBatchGroups;
