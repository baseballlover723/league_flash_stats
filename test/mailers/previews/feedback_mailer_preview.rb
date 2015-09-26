# Preview all emails at http://localhost:3000/rails/mailers/feedback_mailer
class FeedbackMailerPreview < ActionMailer::Preview
  def feedback_email_preview
    FeedbackMailer.feedback_email(
        Feedback.new({name: "philip", from_email: "philipross723@yahoo.com", message: "test", spam: ""}))
  end
end
