import { MongoClient } from 'mongodb'
import { ACES_DB, EV_DB } from 'config/db'

const uri = process.env.NODE_ENV == 'development' ? process.env.MONGO_LOCAL : process.env.MONGO_AWSGM2

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export async function connect() {
  if (!client.isConnected()) await client.connect()

  const dba = client.db(ACES_DB);
  const dbe = client.db(EV_DB);

  return { dba, dbe, client }
}