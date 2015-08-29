class AdminController < ApplicationController
  @@polling = false
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
  end

  def stop_polling
    puts "not polling" and return unless @@polling
    @@polling = false
    puts "stopping polling"
    index
    render action: 'index'
  end
end
