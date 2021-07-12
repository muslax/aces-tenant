// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connect } from "lib/database"

export default async function helloAPI(req, res) {
  const { dba } = await connect();
  const cs = await dba.collection("VLogin").aggregate([
    { $match: { _id: "60e390b87789b2a54ebc2ff5" }},
    { $limit: 1 },
    { $lookup: {
      from: 'tenants', localField:'lid', foreignField:'lid', as:'tenant'
    }},
    { $unwind: "$tenant"}
  ])

  const rs = await cs.next();
  console.log(rs)

  res.status(200).json({ name: 'John Doe' })
}
