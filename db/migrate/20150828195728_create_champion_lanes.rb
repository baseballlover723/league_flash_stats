class CreateChampionLanes < ActiveRecord::Migration
  def change
    create_table :champion_lanes do |t|
      t.string :lane
      t.belongs_to :champion, index: true
      t.timestamps null: false
    end
  end
end
