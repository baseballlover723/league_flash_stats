Rails.application.routes.draw do
  get 'admin/', to: 'admin#index', as: :admin_index
  post 'admin/', to: 'admin#start_stop_polling', as: :start_stop_polling
  put 'admin/', to: 'admin#reset_index', as: :reset_index
  delete 'admin/', to: 'admin#change_region', as: :change_region

  get '/', to: 'champion#index', as: :champion_index
  get '/overall', to: 'champion#overall', as: :overall
  get '/:id', to: 'champion#show', as: :champion_show

end
