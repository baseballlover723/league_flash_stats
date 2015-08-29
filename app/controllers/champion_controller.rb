class ChampionController < ApplicationController
  def show
  end

  def index
    @champions = Champion.all
  end

  def create
  end
end
