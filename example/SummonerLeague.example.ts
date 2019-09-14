import { RiotApi } from '../src'
import { config } from './config';

const api = new RiotApi()

async function example () {
  const { region } = config
  const { id } = await api.summoner.getByName(config.summonerName, region)
  const league = await api.league.bySummoner(id, region)
  console.log(league)
}

example()
