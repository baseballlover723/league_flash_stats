class CreateChampionLanes < ActiveRecord::Migration
  def change
    create_table :champion_lanes do |t|

      t.timestamps null: false
    end
  end
end
