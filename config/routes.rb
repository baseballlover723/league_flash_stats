Rails.application.routes.draw do
  get 'admin/index'
  post 'admin/index', to: 'admin#start_stop_polling', as: :start_stop_polling
  put 'admin/index', to: 'admin#reset_index', as: :reset_index
  delete 'admin/index', to: 'admin#change_region', as: :change_region

  get 'champion/index', to: 'champion#index', as: :champion_index
  get 'champion/:id', to: 'champion#show', as: :champion_show

  get 'champion/index'
  get 'champion/create'

end
