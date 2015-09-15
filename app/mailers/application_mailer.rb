class ApplicationMailer < ActionMailer::Base
  default from: "feedback@leagueflashstats.herokuapp.com"
  layout 'mailer'
end
