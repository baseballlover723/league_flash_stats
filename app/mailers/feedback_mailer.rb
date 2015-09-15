class FeedbackMailer < ApplicationMailer
  @@our_email = "league-flash-stats@gmail.com"

  def feedback_email(feedback)
    @name = feedback.name
    @message = feedback.message
    mail(from: feedback.from_email, to: @@our_email, subject: "[Feedback]")
  end
end
