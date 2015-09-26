require 'sendgrid-ruby'
class FeedbackController < ApplicationController
  @@no_email = "feedback@leagueflashstats.com"
  @@our_email = "leagueflashstats@gmail.com"
  @@client = nil

  def new
    @feedback = Feedback.new
  end

  def create
    check_params = params.require(:feedback).permit([:name, :message, :from_email, :spam])
    check_params[:from_email] = @@no_email unless check_params[:from_email].present?
    @feedback = Feedback.new(check_params)

    client = get_client
    if @feedback.valid?
      html_string = render_to_string(
          partial: 'feedback_mailer/feedback_email', layout: false,
          locals: {name: @feedback.name, from_email: @feedback.from_email, message: @feedback.message}
      ).to_str
      mail = SendGrid::Mail.new do |m|
        m.to = @@our_email
        m.from = "#{@feedback.name}.#{@@no_email}"
        m.reply_to = @feedback.from_email
        m.subject = "[Feedback] from #{@feedback.name}"
        m.html = html_string
      end

      if client.send(mail)
        puts "sent email"
        redirect_to "/", flash: {success: 'Thank you for your message. We will contact you soon!'}
      else
        puts "didn't send email"
        flash.now[:alert] = "Couldn't send message."
        render :new
      end
    else
      flash.now[:alert] = @feedback.spam ? "Please don't spam our email" : "Misconfiguered email. Double check that you entered in all the right values"
      render :new
    end
  end

  def get_client()
    @@client if @@client
    @@client = SendGrid::Client.new(api_user: ENV['SENDGRID_USERNAME'], api_key: ENV['SENDGRID_PASSWORD'])
  end
end
