db.createView("VTenan",
  "tenants",
  [
    { $lookup: { from: "licenses", localField: "lid", foreignField: "_id", as: "license" } },
    { $lookup: { from: "users", localField: "uid", foreignField: "_id", as: "owner" } },
    { $unwind: '$license'},
    { $unwind: '$owner'},
    { $project: {
      uid: 1,
      license: 1,
      owner: 1,
    }}
  ]
)

db.createView("VLicenses",
  "licenses",
  [

  ]
)

db.createView ("VLogin",
  "users",
  [
    { $lookup: { from: "licenses", localField: "lid", foreignField: "_id", as: "license" } },
    { $unwind: '$license'},
    { $project: {
      lid: 1,
      username: 1,
      fullname: 1,
      email: 1,
      deleted: 1,
      disabled: 1,
      verified: 1,
      hashed_password: 1,
      license: 1,
    }}
  ]
)

db.createView ("VBatches",
  "batches",
  [
    { $lookup: { from: "personae", localField: "_id", foreignField: "bid", as: "personae" } },
    { $lookup: { from: "groups", localField: "_id", foreignField: "bid", as: "groups" } },
    { $project: {
      "pid": 1,
	  "title": 1,
	  "token": 1,
	  "modules": 1,
	  "order": 1,
	  "timing": 1,
	  "date1": 1,
	  "date2": 1,
	  "protected": 1,
	  "disabled": 1,
	  "personae": { $size: "$personae"},
      "groups": { $size: "$groups"},
    }}
  ]
)

// Lookup VBatches
db.createView ("VProjects",
  "projects",
  [
    { $lookup: { from: "users", localField: "admin", foreignField: "username", as: "projectAdmin" } },
    { $lookup: { from: "clients", localField: "cid", foreignField: "_id", as: "client" } },
    { $lookup: { from: "VBatches", localField: "_id", foreignField: "pid", as: "batches" } },
    { $unwind: '$projectAdmin'},
    { $unwind: '$client'},
    { $project: {
      lid: 1,
      title: 1,
      fullTitle: 1,
      description: 1,
      contractDate: 1,
      batchMode: 1,
      'admin.username': '$projectAdmin.username',
      'admin.fullname': '$projectAdmin.fullname',
      "client._id": 1,
      "client.name": 1,
      "client.address": 1,
      "client.city": 1,
      batches: 1,
    }}
  ]
)
