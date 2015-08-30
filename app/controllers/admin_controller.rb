require 'csv'
require 'concurrent'

KEY_SLEEP = 2
MATCH_COUNT_LIMIT = 2000
MATCH_DATA = "BILGEWATER_DATASET/NA.json"

class AdminController < ApplicationController
  @@polling = false
  @@base_request = "na.api.pvp.net"
  @@request_path = "/api/lol/na/v2.2/match/"

  @@match_ids = false
  @@index = false

  def index
    @is_db_clean = (Rank.where.not(wins: 0).length + Rank.where.not(losses: 0).length) == 0 && Rank.all.length == 12096
    @index = @@index || get_last_match_id_index
    @start_stop_string = @@polling ? "Stop" : "Start"
  end

  def start_stop_polling
    @@polling ? stop_polling : start_polling
  end

  def start_polling
    puts "already polling" and return if @@polling
    @@polling = true
    puts "starting polling"
    index
    render action: 'index'
    Concurrent::Future.execute { poll }
  end

  def stop_polling
    puts "not polling" and return unless @@polling
    @@polling = false
    puts "stopping polling"
    index
    render action: 'index'
  end

  def poll
    begin
      puts "polling"
      count = 0
      while true do
        return exit_polling unless @@polling
        keys.each do |key|
          return exit_polling unless @@polling
          match_id = get_next_match_id
          return exit_polling unless match_id
          match_uri = URI::HTTPS.build(host: @@base_request,
                                       path: @@request_path + match_id,
                                       query: {api_key: key}.to_query)
          puts "polling. count: #{count}, index: #{@@index} match id: #{match_id} on key: #{key}"

          response = HTTParty.get(match_uri, verify: false)
          if response.code == 200
            handle_response response.parsed_response
            write_match_index @@index
            increment_index
            count += 1
            if count > MATCH_COUNT_LIMIT
              puts "stopping polling to avoid database querying limits"
              return exit_polling
            end
          else
            puts "Error in match request"
            puts response
          end
        end
        puts "sleeping **********************************************************"
        sleep KEY_SLEEP
      end
      exit_polling
    rescue Exception => e
      puts "error in async poll"
      puts e.message
      puts e.backtrace.inspect
      exit_polling
    end
  end

  def handle_response(response)
    response["participants"].each do |participant|
      rank = participant["highestAchievedSeasonTier"].downcase
      champion_id = participant["championId"]
      lane = parse_lane participant["timeline"]["lane"].downcase

      won = participant["stats"]["winner"]
      flash_on_d = participant["spell1Id"] == 4
      flash_on_f = participant["spell2Id"] == 4

      has_flash = flash_on_d || flash_on_f

      rank = Rank.where(champion_id: champion_id, lane: lane, rank: rank, has_flash: has_flash, flash_on_f: flash_on_f)
      if won
        rank.update_all("wins = wins + 1")
      else
        rank.update_all("losses = losses + 1")
      end
    end
  end

  def exit_polling
    @@polling = false
    puts "done polling"
  end

  def parse_lane(lane)
    return "bot" if lane == "bottom"
    return "mid" if lane == "middle"
    lane
  end

  def get_next_match_id
    @@index = get_last_match_id_index unless @@index
    match_ids[@@index].to_s
  end

  def increment_index
    @@index += 1
  end

  def write_match_index(match_index)
    db_object = LastMatchIndex.first
    db_object.index = match_index
    db_object.save!
  end

  def get_last_match_id_index
    LastMatchIndex.first.index + 1
  end

  def match_ids
    return @@match_ids if @@match_ids
    file = File.read(MATCH_DATA)
    @@match_ids = JSON.parse(file)
  end
end
