class ChampionController < ApplicationController
  def show
  end

  def index
    @riot_path = "https://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/"
    @champions = Champion.all
  end

  def create
  end
end
