class CreateRanks < ActiveRecord::Migration
  def change
    create_table :ranks do |t|
      t.string :rank
      t.integer :wins
      t.integer :losses
      t.boolean :has_flash
      t.boolean :flash_on_f
      t.belongs_to :champion_lane, index: true
      t.timestamps null: false
    end
  end
end
