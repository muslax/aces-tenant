import { QUERIES } from "lib/queries";
import withSession from "lib/session";

const ACCEPTED_QUERIES = QUERIES;

export default withSession(async (req, res) => {
  const apiUser = req.session.get("user");

  if (!apiUser || apiUser.isLoggedIn === false) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { q } = req.query;

  if (!q || !ACCEPTED_QUERIES[q]) {
    return res.status(400).json({ message: 'Bad Request' })
  }

  const task = ACCEPTED_QUERIES[q];
  return task (req, res);
});
