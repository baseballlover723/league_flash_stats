class Feedback < ActiveRecord::Base
  validates :name, presence: true
  validates :from_email, format: {with: /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i}
  validates :message, presence: true
  validates :nickname, presence: false
end
