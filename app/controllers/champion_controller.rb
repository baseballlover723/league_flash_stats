LANES = %w(top mid bot jungle)
FLASH_STATES = %w(no_flash flash_on_f flash_on_d)
RANKS = %w(unranked bronze silver gold platinum diamond master challenger)
OVERALL_CACHE_TIME = 2.minutes

class ChampionController < ApplicationController
  def show
    @riot_path = "https://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/"
    @splash_path = "https://ddragon.leagueoflegends.com/cdn/img/champion/"
    @champion = Champion.find(params.require(:id))

    flash_hash = {no_flash: [], flash_on_f: [], flash_on_d: []}.with_indifferent_access
    @buckets = {
        overall: flash_hash,
        top: flash_hash.deep_dup,
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
      @buckets["overall"][flash_state] << rank
    end
  end

  def index
    @riot_path = "https://ddragon.leagueoflegends.com/cdn/5.16.1/img/champion/"
    @champions = Champion.all.sort_by { |champion| champion.name }
  end

  def overall
    @total_number_of_games = Rails.cache.fetch('number_of_games', expires_in: OVERALL_CACHE_TIME) do
      total_rank = Rank.select("SUM(ranks.wins) AS wins, SUM(ranks.losses) AS losses")[0]
      total_rank.wins + total_rank.losses
    end
    flash_hash = {no_flash: [], flash_on_f: [], flash_on_d: []}.with_indifferent_access
    @buckets = Rails.cache.fetch('buckets', expires_in: OVERALL_CACHE_TIME) do
      puts "fetching overall buckets"
      @buckets = {
          overall: flash_hash,
          top: flash_hash.deep_dup,
          mid: flash_hash.deep_dup,
          bot: flash_hash.deep_dup,
          jungle: flash_hash.deep_dup
      }.with_indifferent_access

      LANES.each do |lane|
        FLASH_STATES.each do |flash_state|
          has_flash = true
          flash_on_f = false

          if flash_state == "no_flash"
            has_flash = false
          elsif flash_state == "flash_on_f"
            flash_on_f = true
          end
          # do ranks if we can
          RANKS.each do |rank|
            bucket = Rank.select("SUM(ranks.wins) AS wins, SUM(ranks.losses) AS losses, has_flash, flash_on_f, lane, rank").
                where(lane: lane, has_flash: has_flash, flash_on_f: flash_on_f, rank: rank)[0]
            @buckets[lane][flash_state] << bucket
            @buckets["overall"][flash_state] << bucket
          end
        end
      end
      @buckets
    end
  end
end
