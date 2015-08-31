require 'csv'
require 'concurrent'

KEY_SLEEP = 2
MATCH_COUNT_LIMIT = 2000
MATCH_DATA = "BILGEWATER_DATASET/"

class AdminController < ApplicationController
  http_basic_authenticate_with name: ENV["ADMIN_USERNAME"], password: ENV["ADMIN_PASSWORD"]

  @@polling = false
  @@base_request = ".api.pvp.net"
  @@request_path = "/api/lol/"
  @@request_path_2 = "/v2.2/match/"
  @@region_dataset = Region.first.region

  @@match_ids = false
  @@index = false

  def index
    @is_db_clean = (Rank.where.not(wins: 0).length + Rank.where.not(losses: 0).length) == 0 && Rank.all.length == 12096
    @index = @@index || get_last_match_id_index
    @file_path = MATCH_DATA + @@region_dataset.upcase + ".json"
    @start_stop_string = @@polling ? "Stop" : "Start"
  end

  def reset_index
    puts "reseting index to 0 **************************************************************"
    LastMatchIndex.update_all index: -1
    @@index = false
    index
    render action: 'index'
  end

  def change_region
    puts "changing region"
    @@region_dataset = params.require(:region).gsub(/\.json/, "").downcase
    Region.update_all region: @@region_dataset
    @@match_ids = false
    index
    render action: 'index'
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
        if !@@polling
          return exit_polling
        end
        keys.each do |key|
          if !@@polling
            return exit_polling
          end
          match_id = get_next_match_id
          if match_id.empty?
            puts "got to the end of the '#{@@region_dataset}' dataset"
            return exit_polling
          end
          match_uri = URI::HTTPS.build(host: @@region_dataset + @@base_request,
                                       path: @@request_path + @@region_dataset + @@request_path_2 + match_id,
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
    file_name = MATCH_DATA + @@region_dataset.upcase + ".json"
    file = File.read(file_name)
    @@match_ids = JSON.parse(file)
  end
end
