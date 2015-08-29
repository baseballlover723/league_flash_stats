require 'csv'
class AdminController < ApplicationController
  @@polling = false
  @@base_request = "global.api.pvp.net"
  @@champion_request_path = "/api/lol/static-data/na/v1.2/champion"

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
        champion_uri = URI::HTTPS.build(host: base_champion_request,
                                        path: champion_request_path,
                                        query: {champData: "image", api_key: keys[0]}.to_query)
        response = HTTParty.get(champion_uri, verify: false).parsed_response
        champions = response["data"]

      end


      recent_posts = HTTParty.get "http://www.example.org/?json=get_recent_posts"
      puts recent_posts.status, recent_posts.count

      recent_posts.posts.each do |post|
        puts post.title #guessing
      end
    end
  end
end

