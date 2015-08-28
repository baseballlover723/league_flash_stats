class CreateChampions < ActiveRecord::Migration
  def change
    create_table :champions do |t|

      t.timestamps null: false
    end
  end
end
