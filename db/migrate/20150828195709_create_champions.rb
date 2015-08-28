class CreateChampions < ActiveRecord::Migration
  def change
    create_table :champions do |t|
      t.integer :champion_id
      t.string :name
      t.string :title
      t.string :img
      t.timestamps null: false
    end
  end
end
