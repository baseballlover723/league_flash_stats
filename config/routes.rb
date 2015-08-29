Rails.application.routes.draw do
  get 'admin/index'
  post 'admin/index', to: 'admin#start_stop_polling', as: :start_stop_polling


  get 'champion/index', to: 'champion#index', as: :champion_index
  get 'champion/:id', to: 'champion#show', as: :champion_show

  get 'champion/index'
  get 'champion/create'

end
