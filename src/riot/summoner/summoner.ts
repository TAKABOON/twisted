import * as _ from 'lodash'
import { BaseApi } from '../base'
import { endpointsV4 } from '../../enum/endpoints.enum'
import { SummonerV4DTO } from '../../dto/Summoner/Summoner.dto'
import { FindSummonerBy, Regions } from '../../enum'

/**
 * Summoner methods
 */
export class SummonerApi extends BaseApi {
  private parsePath (by: FindSummonerBy) {
    let { path } = endpointsV4.Summoner
    if (by === FindSummonerBy.ID) {
      path = path.replace('/$(by)/', '/')
    }
    return path
  }
  private genericRequest (by: FindSummonerBy, value: string, region: Regions) {
    const endpoint = _.cloneDeep(endpointsV4.Summoner)
    endpoint.path = this.parsePath(by)
    const params = {
      summonerName: value,
      by
    }
    return this.request<SummonerV4DTO>(region, endpoint, params)
  }
  /**
   * Get by name
   * @param summonerName Summoner name
   * @param region Riot region
   */
  public async getByName (summonerName: string, region: Regions) {
    return this.genericRequest(FindSummonerBy.NAME, summonerName, region)
  }
  /**
   * Get by id
   * @param id Summoner id
   * @param region Riot region
   */
  public async getById (id: string, region: Regions) {
    return this.genericRequest(FindSummonerBy.ID, id, region)
  }
  /**
   * Get by PUUID
   * @param puuid
   * @param region Riot region
   */
  public async getByPUUID (puuid: string, region: Regions) {
    return this.genericRequest(FindSummonerBy.PUUID, puuid, region)
  }
  /**
   * Get by PUUID
   * @param puuid
   * @param region Riot region
   */
  public async getByAccountID (accountId: string, region: Regions) {
    return this.genericRequest(FindSummonerBy.ACCOUNT_ID, accountId, region)
  }
}