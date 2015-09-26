class ChangeFeedbackNickname < ActiveRecord::Migration
  def change
    rename_column :feedbacks, :nickname, :spam
  end
end
