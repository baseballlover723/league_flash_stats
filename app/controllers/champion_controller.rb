LANES = %w(top mid bot jungle)
FLASH_STATES = %w(no_flash flash_on_f flash_on_d)
class ChampionController < ApplicationController
  def show
  	@riot_path = "https://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/"
  	@splash_path = "https://ddragon.leagueoflegends.com/cdn/img/champion/"
  	@champion = Champion.find(params.require(:id))
  	puts @champion.as_json

    flash_hash = {no_flash: [], flash_on_f: [], flash_on_d: []}.with_indifferent_access
    @buckets = {
        top: flash_hash,
        mid: flash_hash.deep_dup,
        bot: flash_hash.deep_dup,
        jungle: flash_hash.deep_dup
    }.with_indifferent_access

    @champion.ranks.each do |rank|
      if rank.has_flash
        flash_state = rank.flash_on_f ? "flash_on_f" : "flash_on_d"
      else
        flash_state = "no_flash"
      end
      @buckets[rank.lane][flash_state] << rank
    end

    @buckets.each do |lane, flash_states|
      puts ""
      puts "**********************************************\n"
      puts lane
      flash_states.each do |flash_state, ranks|
        puts ""
        puts flash_state
        ranks.each do |rank|
          puts rank.as_json
        end
      end
    end

  end

  def index
    @riot_path = "https://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/"
    @champions = Champion.all.sort_by{ |champion| champion.name }
  end

  def create
  end
end
