require 'csv'
class AdminController < ApplicationController
  @@polling = false
  @@base_request = "na.api.pvp.net"
  @@request_path = "/api/lol/na/v2.2/match/"
  @@match_id = 1907069332

  def index
    @start_stop_string = @@polling ? "Stop" : "Start"
  end

  def start_stop_polling
    puts "start_stop_polling"
    @@polling ? stop_polling : start_polling
  end

  def start_polling
    puts "already polling" and return if @@polling
    @@polling = true
    puts "starting polling"
    index
    render action: 'index'
    poll
  end

  def stop_polling
    puts "not polling" and return unless @@polling
    @@polling = false
    puts "stopping polling"
    index
    render action: 'index'
  end

  def poll
    puts "polling"
    while @@polling do
      keys.each do |key|
        match_uri = URI::HTTPS.build(host: @@base_request,
                                     path: @@request_path + get_next_match_id,
                                     query: {api_key: key}.to_query)
        response = HTTParty.get(match_uri, verify: false).parsed_response
        response["participants"].each do |participant|
          rank = participant["highestAchievedSeasonTier"].downcase
          champion_id = participant["championId"]
          lane = parse_lane participant["timeline"]["lane"].downcase

          won = participant["stats"]["winner"]
          flash_on_d = participant["spell1Id"] == 4
          flash_on_f = participant["spell2Id"] == 4


          has_flash = flash_on_d || flash_on_f

          champion_lane = ChampionLane.find_by(champion_id: champion_id, lane: lane)
          rank = Rank.find_by(champion_lane: champion_lane, rank: rank, has_flash: has_flash, flash_on_f: flash_on_f)
          if won
            rank.wins += 1
          else
            rank.losses += 1
          end
          rank.save!
        end
        return
      end
    end
  end

  def get_next_match_id
    @@match_id.to_s
  end

  def parse_lane(lane)
    return "bot" if lane == "bottom"
    return "mid" if lane == "middle"
    lane
  end
end
