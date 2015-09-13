class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  rescue_from Mysql2::Error do |exception|
    puts "Mysql error"
    mysql_error exception
  end

  rescue_from ActiveRecord::ActiveRecordError do |exception|
    puts "Active record error"
    mysql_error exception
  end


  def mysql_error(expection)
    puts expection.inspect
    render 'error/mysql'
  end

  def keys
    ENV['RIOT_API_KEYS'].split(" ")
  end
end
