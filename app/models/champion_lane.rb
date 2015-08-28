class ChampionLane < ActiveRecord::Base
  belongs_to :champion
  has_many :ranks
end
