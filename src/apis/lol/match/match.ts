import { MatchListingDto } from '../../../models-dto/matches/match-listing/match-listing.dto'
import { Regions } from '../../../constants'
import { endpointsV4 } from '../../../endpoints/endpoints'
import { MatchDto } from '../../../models-dto/matches/match/Match.dto'
import { MatchTimelineDto } from '../../../models-dto/matches/match-timeline/match-timeline.dto'
import { MatchQueryDTO } from '../../../models-dto/matches/query/match-query.dto'
import { NOT_FOUND } from 'http-status-codes'
import { GenericError } from '../../../errors'
import { ApiResponseDTO } from '../../../models-dto'
import { BaseApiLol } from '../base/base.api.lol'

/**
 * Match methods
 */
export class MatchApi extends BaseApiLol {
  // Private methods
  private generateResponse (error: GenericError): ApiResponseDTO<MatchListingDto> {
    return {
      rateLimits: error.rateLimits,
      response: {
        matches: [],
        startIndex: 0,
        endIndex: 0,
        totalGames: 0
      }
    }
  }
  private map (match: ApiResponseDTO<MatchDto>) {
    match.response.teams = match.response.teams.map((team) => {
      team.win = (team.win as any) === 'Win'
      return team
    })
    match.response.remake = match.response.teams.every(t => !t.firstTower)
    return match
  }
  /**
   * Get match details
   * @param matchId Match id
   * @param region
   */
  public async get (matchId: number, region: Regions) {
    const params = {
      matchId
    }
    const data = await this.request<MatchDto>(region, endpointsV4.Match, params)
    return this.map(data)
  }
  /**
   * Summoner match listing
   * @param encryptedAccountId Encrypted summoner ID. Max length 63 characters.
   * @param region
   */
  public async list (encryptedAccountId: string, region: Regions, query?: MatchQueryDTO) {
    const params = {
      encryptedAccountId
    }
    try {
      return await this.request<MatchListingDto>(region, endpointsV4.MatchListing, params, false, query)
    } catch (e) {
      if (e.status !== NOT_FOUND) {
        throw e
      }
      return this.generateResponse(e)
    }
  }

  public async timeline (matchId: number, region: Regions) {
    const params = {
      matchId
    }
    return this.request<MatchTimelineDto>(region, endpointsV4.MatchTimeline, params)
  }
}
