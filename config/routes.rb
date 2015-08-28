Rails.application.routes.draw do
  get 'admin/index'
  post 'admin/index', to: 'admin#start_stop_polling', as: :start_stop_polling

  get 'champion/show'
  get 'champion/index'
  get 'champion/create'

end
