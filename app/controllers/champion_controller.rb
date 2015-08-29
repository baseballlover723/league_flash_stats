class ChampionController < ApplicationController
  def show
  end

  def index
    @riot_path = "https://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/"
    @champions = Champion.all.sort_by{ |champion| champion.name }
  end

  def create
  end
end
