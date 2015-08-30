require 'csv'
require 'concurrent'

KEY_SLEEP = 1.5
LAST_MATCH_FILENAME = "last_match_id.txt"
MATCH_DATA = "BILGEWATER_DATASET/NA.json"

class AdminController < ApplicationController
  @@polling = false
  @@base_request = "na.api.pvp.net"
  @@request_path = "/api/lol/na/v2.2/match/"

  @@match_ids = false
  @@index = false

  def index
    # Rank.where(wins: 1).each do |rank|
    #   rank.inspect
    #   rank.champion_lane.champion_id.inspect
    #   puts rank.as_json
    #   puts rank.champion_lane.champion_id
    #   puts ""
    # end
    puts @@index
    @start_stop_string = @@polling ? "Stop" : "Start"
  end

  def start_stop_polling
    @@polling ? stop_polling : start_polling
  end

  def start_polling
    logger.warn "already polling" and return if @@polling
    @@polling = true
    logger.info "starting polling"
    index
    render action: 'index'
    Concurrent::Future.execute { poll }
  end

  def stop_polling
    logger.warn "not polling" and return unless @@polling
    @@polling = false
    logger.info "stopping polling"
    index
    render action: 'index'
  end

  def poll
    begin
      logger.info "polling"
      while @@polling do
        keys.each do |key|
          match_id = get_next_match_id
          return exit_polling unless match_id
          match_uri = URI::HTTPS.build(host: @@base_request,
                                       path: @@request_path + match_id,
                                       query: {api_key: key}.to_query)
          logger.info "polling. index: #{@@index} match id: #{match_id} on key: #{key}"

          response = HTTParty.get(match_uri, verify: false)
          if response.code == 200
            handle_response response.parsed_response
            write_match_id match_id
            increment_index
          else
            logger.error "Error in match request"
            logger.error response
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

      champion_lane = ChampionLane.find_by(champion_id: champion_id, lane: lane)
      rank = Rank.find_by(champion_lane: champion_lane, rank: rank, has_flash: has_flash, flash_on_f: flash_on_f)
      if won
        rank.wins += 1
      else
        rank.losses += 1
      end
      rank.save!
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
    puts "index = #{@@index}"
    match_ids[@@index].to_s
  end

  def increment_index
    @@index += 1
  end

  def write_match_id(match_id)
    file = File.open(LAST_MATCH_FILENAME, "w")
    file.puts match_id
    file.close
  end

  def get_last_match_id_index
    last_match_id = File.read(LAST_MATCH_FILENAME).to_i
    match_ids.index(last_match_id) || 0
  end

  def match_ids
    return @@match_ids if @@match_ids
    file = File.read(MATCH_DATA)
    @@match_ids = JSON.parse(file)
  end
end
