LANES = %w(top mid bot jungle)
FLASH_STATES = %w(no_flash flash_on_f flash_on_d)
RANKS = %w(unranked bronze silver gold platinum diamond master challenger)

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
    flash_hash = {no_flash: [], flash_on_f: [], flash_on_d: []}.with_indifferent_access
    @buckets = {
        overall: flash_hash,
        top: flash_hash.deep_dup,
        mid: flash_hash.deep_dup,
        bot: flash_hash.deep_dup,
        jungle: flash_hash.deep_dup
    }.with_indifferent_access
    # @buckets = {
    #     overall: {
    #       no_flash: Rank.new(lane: "overall", wins: 0, losses: 0, has_flash: false, flash_on_f: false),
    #       flash_on_f: Rank.new(lane: "overall", wins: 0, losses: 0, has_flash: true, flash_on_f: true),
    #       flash_on_d: Rank.new(lane: "overall", wins: 0, losses: 0, has_flash: true, flash_on_f: false)},
    #     top: flash_hash.deep_dup,
    #     mid: flash_hash.deep_dup,
    #     bot: flash_hash.deep_dup,
    #     jungle: flash_hash.deep_dup
    # }.with_indifferent_access

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
          # overall_rank = {lane: lane, has_flash: has_flash, flash_on_f: flash_on_f}.with_indifferent_access
          # overall_rank["wins"] = Rank.where(lane: lane, has_flash: has_flash, flash_on_f: flash_on_f).sum("wins")
          # overall_rank["losses"] = Rank.where(lane: lane, has_flash: has_flash, flash_on_f: flash_on_f).sum("losses")

          bucket = Rank.select("SUM(ranks.wins) AS wins, SUM(ranks.losses) AS losses, has_flash, flash_on_f, lane, rank").
              where(lane: lane, has_flash: has_flash, flash_on_f: flash_on_f, rank: rank)[0]
          @buckets[lane][flash_state] << bucket
          @buckets["overall"][flash_state] << bucket

          # @buckets["overall"][flash_state].wins += overall_rank.wins
          # @buckets["overall"][flash_state].losses += overall_rank.losses
        end
      end
    end
  end
end
