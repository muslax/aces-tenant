import { DB } from "config/db";
import { connect } from "lib/database";
import withSession from "lib/session";
import bcrypt from 'bcryptjs';

export default withSession(async (req, res) => {
  try {
    const { username, password } = req.body;
    const { dba } = await connect();
    // DB.USERVIEW
    // const rs = await dba.collection("VLogin").findOne({
    //   username: username,
    //   disabled: false,
    //   deleted: false,
    // });

    const cs = await dba.collection("VLogin").aggregate([
      { $match: { username: username }},
      { $limit: 1 },
      { $lookup: {
        from: 'tenants', localField:'lid', foreignField:'lid', as:'tenant'
      }},
      { $unwind: "$tenant"}
    ])

    const rs = await cs.next();

    if (!rs) {
      return res.status(404).json({ message: "[NOPE] Username/password salah." });
    }

    const verified = bcrypt.compareSync(password, rs.hashed_password);
    if (!verified) {
      return res.status(404).json({ message: "[FAILED] Username/password salah." });
    }

    const user = {
      isLoggedIn: true,
      _id: rs._id,
      username: rs.username,
      fullname: rs.fullname,
      email: rs.email,
      licenseOwner: rs._id == rs.tenant.uid,
      license: {
        _id: rs.license._id,
        type: rs.license.type,
        title: rs.license.title,
        disabled: rs.license.disabled,
        logoUrl: rs.license.logoUrl,
      },
    }

    // console.log("USER", user)

    req.session.set("user", user);
    await req.session.save();
    return res.json(user);
  } catch (error) {
    res.status(404);
    res.json({ message: "[3] Username/password salah." });
  }
});