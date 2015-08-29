base_champion_request = "global.api.pvp.net"
champion_request_path = "/api/lol/static-data/na/v1.2/champion"

def keys
  key_array ||= []
  return key_array if key_array.present?
  key_array = []
  csv_text = File.read('keys.csv')
  csv = CSV.parse(csv_text)
  csv.each do |key|
    key_array << key[0]
  end
  key_array
  end

def createLanes(champion)
  createRanks ChampionLane.create(champion: champion, lane: "top")
  createRanks ChampionLane.create(champion: champion, lane: "mid")
  createRanks ChampionLane.create(champion: champion, lane: "bot")
  createRanks ChampionLane.create(champion: champion, lane: "jungle")
end

def createRanks(champion_lane)
  [true, false].each do |has_flash|
    [true, false].each do |flash_on_f|
      return if !has_flash && !flash_on_f
      %w(bronze, silver, gold, platinum diamond master challenger).each do |rank|
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

  createLanes Champion.create(id: id, name: name, title: title, img: img)
  puts "done with champion ##{index+1} of #{champions.length}"
end

puts "#champs = #{Champion.all.count}"
puts "#champs with lanes = #{ChampionLane.all.count}"
puts "#rank buckets = #{Rank.all.count}"

