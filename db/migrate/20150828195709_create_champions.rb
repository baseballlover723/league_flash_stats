class CreateChampions < ActiveRecord::Migration
  def change
    create_table :champions do |t|
      t.string :name
      t.string :title
      t.timestamps null: false
    end
  end
end
