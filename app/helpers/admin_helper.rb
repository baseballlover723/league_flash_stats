module AdminHelper
  def get_champion_name(id)
    Rails.cache.fetch("champion_name_#{id}", expires_in: CHAMPION_NAME_CACHE_TIME) do
      Champion.find(id).name
    end
  end
end
