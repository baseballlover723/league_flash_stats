class ErrorController < ApplicationController
  def mysql
    render 'mysql', status: :service_unavailable
  end
end
