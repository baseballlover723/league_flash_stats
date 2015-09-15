class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.string :name
      t.string :from_email
      t.string :message
      t.string :nickname

      t.timestamps null: false
    end
  end
end
