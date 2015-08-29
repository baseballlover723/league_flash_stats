class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def keys
    return @@keys if @@keys.present?
    puts "gen keys"
    @@keys = []
    csv_text = File.read('keys.csv')
    csv = CSV.parse(csv_text)
    csv.each do |key|
      @@keys << key[0]
    end
    @@keys
  end
end
