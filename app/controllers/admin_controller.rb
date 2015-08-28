class AdminController < ApplicationController
  @@polling = false
  def index
    @var = 5
  end

  def start_stop_polling
    puts "start_stop_polling"
  end

  def start_polling
    puts "already polling" and return if @@polling
    data = File.read("/path/to/file")
  end

  def stop_polling
    puts "not polling" and return unless @@polling
  end
end
