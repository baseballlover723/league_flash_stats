keys = ENV['RIOT_API_KEYS'].split(" ")

RANKS = %w(unranked bronze silver gold platinum diamond master challenger)
base_champion_request = "global.api.pvp.net"
champion_request_path = "/api/lol/static-data/na/v1.2/champion"

def createLanes(champion)
  createRanks ChampionLane.create(champion: champion, lane: "top")
  createRanks ChampionLane.create(champion: champion, lane: "mid")
  createRanks ChampionLane.create(champion: champion, lane: "bot")
  createRanks ChampionLane.create(champion: champion, lane: "jungle")
end

def createRanks(champion_lane)
  [true, false].each do |has_flash|
    [false, true].each do |flash_on_f|
      return if !has_flash && flash_on_f
      RANKS.each do |rank|
        Rank.create(wins: 0, losses: 0, champion_lane: champion_lane,
                    has_flash: has_flash, flash_on_f: flash_on_f, rank: rank)
      end
    end
  end
end

champion_uri = URI::HTTPS.build(host: base_champion_request,
                                path: champion_request_path,
                                query: {champData: "image", api_key: keys[0]}.to_query)
response = HTTParty.get(champion_uri, verify: false).parsed_response
champions = response["data"]
champions.each_with_index do |champion_response, index|
  champion_response = champion_response[1]

  id = champion_response["id"]
  name = champion_response["name"]
  title = champion_response["title"]
  img = champion_response["image"]["full"]
  splash_img = "splash/" + img.gsub(/\.png$/, "_0.jpg")
  loading_img = "loading/" + img.gsub(/\.png$/, "_0.jpg")

  createLanes Champion.create(id: id, name: name, title: title, img: img,
                              splash_img: splash_img, loading_img: loading_img)
  puts "done with champion ##{index+1} of #{champions.length}"
end

puts "#champs = #{Champion.all.count}"
puts "#champs with lanes = #{ChampionLane.all.count}"
puts "#rank buckets = #{Rank.all.count}"

